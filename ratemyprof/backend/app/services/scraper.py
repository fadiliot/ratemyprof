import requests
from bs4 import BeautifulSoup
import time
from app.db import professors_col   # motor async collection
import asyncio

BASE_URL = "https://www.srmist.edu.in/wp-admin/admin-ajax.php"
HEADERS = {
    "accept": "*/*",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "origin": "https://www.srmist.edu.in",
    "referer": "https://www.srmist.edu.in/staff-finder/",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
    "x-requested-with": "XMLHttpRequest",
}

CAMPUS_ID = "78"
COLLEGE_ID = "9812"
DEPARTMENT_ID = "13519"  # Department of Computing Technologies


def fetch_faculty_page(page_num):
    payload = {
        "page": str(page_num),
        "formData": f"campus={CAMPUS_ID}&college={COLLEGE_ID}&department={DEPARTMENT_ID}&faculty=&facultyType=&designation=",
        "security": "6fe1e1e48e",
        "action": "list_faculties_default"
    }
    res = requests.post(BASE_URL, headers=HEADERS, data=payload)
    res.raise_for_status()
    return res.text


def parse_faculty(html):
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
            "name": name,
            "designation": designation.get_text(strip=True) if designation else "",
            "department": department.get_text(strip=True) if department else "",
            "email": email.get_text(strip=True) if email else "",
            "profile_url": profile_url
        })

    return data


async def scrape_professors():
    total_upserts = 0
    page = 1

    while True:
        print(f"🔎 Fetching page {page}...")

        html = fetch_faculty_page(page)
        faculty_list = parse_faculty(html)

        if not faculty_list:
            print("✅ No more data. Scraping completed.")
            break

        for prof in faculty_list:
            # UPSERT: match by unique profile URL
            result = await professors_col.update_one(
                {"profile_url": prof["profile_url"]},   # unique identifier
                {"$set": prof},
                upsert=True
            )
            if result.upserted_id or result.modified_count > 0:
                total_upserts += 1

        print(f"   → Processed {len(faculty_list)} entries on page {page}")
        page += 1
        time.sleep(1)  #✅ non-blocking sleep

    print(f"🎉 Upserted {total_upserts} professors into MongoDB.")

    return {"status": "success", "total": total_upserts}
