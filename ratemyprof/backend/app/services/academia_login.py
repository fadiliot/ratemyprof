from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError

ACADEMIA_URL = "https://academia.srmist.edu.in/"

def verify_srm_login_sync(email: str, password: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage"]
        )
        page = browser.new_page()

        # Load SRM login page
        page.goto(ACADEMIA_URL, wait_until="networkidle")

        # STEP 1 — Access iframe
        page.wait_for_selector("iframe", timeout=20000)
        iframe_el = page.query_selector("iframe")
        frame = iframe_el.content_frame()

        if frame is None:
            browser.close()
            return {"status": "error", "message": "Unable to access login iframe"}

        # STEP 2 — Email input
        frame.wait_for_selector("#login_id", timeout=15000)
        frame.fill("#login_id", email)
        page.keyboard.press("Enter")

        # STEP 3 — Password field appears (hidden initially)
        try:
            frame.wait_for_selector("#password", state="attached", timeout=15000)
        except:
            browser.close()
            return {"status": "error", "message": "Invalid email format"}

        frame.fill("#password", password)

        # STEP 4 — Click login
        frame.click("#nextbtn")

        # STEP 5 — Detect login failure (SRM shows error div)
        try:
            error_shown = frame.wait_for_selector(".wrongpassword", timeout=3000)
            if error_shown:
                browser.close()
                return {"status": "error", "message": "Invalid SRM credentials"}
        except:
            pass  # No error → valid login likely happening

        # STEP 6 — Wait for redirect (SUCCESS)
        try:
            page.wait_for_url("**/portal/**", timeout=20000)
        except:
            browser.close()
            return {"status": "error", "message": "Invalid SRM credentials"}

        browser.close()
        return {"status": "success", "message": "Valid SRM credentials"}
