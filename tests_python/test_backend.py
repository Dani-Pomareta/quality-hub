import pytest
import requests

BASE_URL = "https://restful-booker.herokuapp.com"

def test_api_health_check():
    """Verify backend is alive (Standard Smoke Test)."""
    response = requests.get(f"{BASE_URL}/ping")
    assert response.status_code == 201

def test_booking_schema_and_data_types():
    """
    Showcase: Deep Data Validation.
    This proves we can catch 'contract' breaks between AI and Frontend.
    """
    # 1. Fetch data
    response = requests.get(f"{BASE_URL}/booking/1")
    assert response.status_code == 200
    
    data = response.json()

    # 2. Check for required keys (The 'Contract')
    required_keys = ["firstname", "lastname", "totalprice", "bookingdates"]
    for key in required_keys:
        assert key in data, f"Critical Failure: Missing key '{key}' in API response"

    # 3. Check Data Types (The 'Integrity')
    # This is vital for AI startups where data types must be strict
    assert isinstance(data["firstname"], str), "Firstname should be a String"
    assert isinstance(data["totalprice"], (int, float)), "Price should be a Number"
    assert isinstance(data["bookingdates"], dict), "BookingDates should be an Object/Dict"

def test_create_booking_and_verify_persistence():
    """Showcase: State Persistence (Creating then Verifying)."""
    payload = {
        "firstname": "Just-A",
        "lastname": "Tester",
        "totalprice": 999,
        "depositpaid": True,
        "bookingdates": {"checkin": "2026-02-01", "checkout": "2026-02-02"},
        "additionalneeds": "High-speed Compute"
    }
    
    # Send the data
    post_response = requests.post(f"{BASE_URL}/booking", json=payload)
    assert post_response.status_code == 200
    
    # Extract the ID created by the server
    booking_id = post_response.json()["bookingid"]
    print(f"Created Booking ID: {booking_id}")
    
    # Verify the data was actually saved correctly
    get_response = requests.get(f"{BASE_URL}/booking/{booking_id}")
    assert get_response.json()["firstname"] == "Just-A"