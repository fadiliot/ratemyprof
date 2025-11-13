import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# --- Constants ---
BASE_URL = "https://www.srmist.edu.in/wp-admin/admin-ajax.php"
HEADERS = {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://www.srmist.edu.in",
    "referer": "https://www.srmist.edu.in/staff-finder/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

# --- Filter IDs ---
# campus=84 → Kattankulathur
# college=3 → Faculty of Engineering and Technology
# department=47 → Computing Technologies (you may confirm by inspecting the dropdown)
CAMPUS_ID = "78"
COLLEGE_ID = "9812"
DEPARTMENT_ID = "13519"  # Computing Technologies

def fetch_faculty_page(page_num):
    """Fetch a single page of faculty data with filters applied."""
    payload = {
        "page": str(page_num),
        "formData": f"campus={CAMPUS_ID}&college={COLLEGE_ID}&department={DEPARTMENT_ID}&faculty=&facultyType=&designation=",
        "security": "6fe1e1e48e",  # may change if SRM updates their site
        "action": "list_faculties_default"
    }

    res = requests.post(BASE_URL, headers=HEADERS, data=payload)
    res.raise_for_status()
    return res.text

def parse_faculty(html):
    """Extract faculty info from HTML."""
    soup = BeautifulSoup(html, "html.parser")
    faculty_cards = soup.select(".staff-card")
    data = []

    for card in faculty_cards:
        name_tag = card.select_one("h3.post-title a")
        name = name_tag.get_text(strip=True) if name_tag else ""
        profile_url = name_tag["href"] if name_tag and name_tag.has_attr("href") else ""

        designation = card.select_one(".designation, .staff-designation, .prof-deg")
        department = card.select_one(".department, .staff-department")
        email = card.select_one("a[href^='mailto:']")

        data.append({
            "Name": name,
            "Designation": designation.get_text(strip=True) if designation else "",
            "Department": department.get_text(strip=True) if department else "",
            "Email": email.get_text(strip=True) if email else "",
            "Profile_URL": profile_url
        })

    return data

# --- Main scraper loop ---
all_faculty = []
page = 1

while True:
    print(f"🔎 Fetching page {page} for Computing Technologies...")
    html = fetch_faculty_page(page)
    faculty_list = parse_faculty(html)

    if not faculty_list:
        print("✅ No more data found. Done scraping.")
        break

    all_faculty.extend(faculty_list)
    print(f"   → Found {len(faculty_list)} entries on page {page}")
    page += 1
    time.sleep(1)

# --- Save results ---
if all_faculty:
    df = pd.DataFrame(all_faculty)
    filename = "srm_fet_computing_tech.csv"
    df.to_csv(filename, index=False, encoding="utf-8")
    print(f"\n🎉 Scraped total {len(all_faculty)} faculty profiles.")
    print(f"📄 Data saved to {filename}")
else:
    print("⚠️ No data found — check department ID or security token.")
