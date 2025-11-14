from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

ACADEMIA_URL = "https://academia.srmist.edu.in/"

def verify_srm_login_sync(email: str, password: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,   # ✔ run without opening window
            args=[
                "--disable-gpu",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",  # ✔ hide automation
                "--disable-infobars",
                "--start-maximized"
            ]
        )

        page = browser.new_page(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            )
        )

        # --- STEP 1: Load SRM login page ---
        page.goto(ACADEMIA_URL, wait_until="domcontentloaded", timeout=60000)

        # --- STEP 2: Access iframe ---
        page.wait_for_selector("iframe", timeout=20000)
        frame = page.query_selector("iframe").content_frame()

        # --- STEP 3: fill email ---
        frame.wait_for_selector("#login_id", timeout=20000)
        frame.fill("#login_id", email)

        # --- CLICK NEXT ---
        frame.click("#nextbtn")

        # --- STEP 4: Wait for password reveal ---
        try:
            frame.wait_for_selector("#password_container", state="visible", timeout=15000)
        except PlaywrightTimeoutError:
            browser.close()
            return {"status": "error", "message": "Invalid SRM email"}

        # --- STEP 5: fill password ---
        frame.fill("#password", password)

        # --- CLICK NEXT AGAIN ---
        frame.click("#nextbtn")

        # --- Step 6: Wrong password detection ---
        try:
            wrong_pw = frame.wait_for_selector(".wrongpassword", timeout=3000)
            if wrong_pw:
                browser.close()
                return {"status": "error", "message": "Invalid SRM credentials"}
        except:
            pass

        # --- STEP 7: Success redirect detection ---
        try:
            page.wait_for_url("**/portal/**", timeout=25000)
        except:
            browser.close()
            return {"status": "error", "message": "Login failed"}

        browser.close()
        return {"status": "success", "message": "Valid SRM credentials"}
