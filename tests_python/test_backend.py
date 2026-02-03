import pytest
from utils.api_client import APIClient

client = APIClient("https://restful-booker.herokuapp.com")

@pytest.fixture
def temp_booking_id():
    # Setup: Create data
    payload = {"firstname": "FakeUser", "lastname": "Lead", "totalprice": 100, 
               "depositpaid": True, "bookingdates": {"checkin": "2026-01-01", "checkout": "2026-01-02"}}
    response = client.create_booking(payload)
    return response.json()["bookingid"]

@pytest.mark.smoke
def test_api_health_check():
    # Basic smoke test for connectivity
    assert client.get_booking(1).status_code != 500

@pytest.mark.regression
@pytest.mark.feature_booking
def test_get_booking_details(temp_booking_id):
    # Regression test using dynamic data
    response = client.get_booking(temp_booking_id)
    assert response.status_code == 200
    assert response.json()["firstname"] == "FakeUser"

    
def test_example(api_client):  # Pytest injects this from conftest
    res = api_client.get_booking(1)
    assert res.status_code == 200