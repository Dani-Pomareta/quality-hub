import pytest
from utils.api_client import APIClient

# This fixture is available to ALL tests automatically
@pytest.fixture(scope="session")
def api_client():
    """
    Initializes the API Client once per test session.
    """
    return APIClient("https://restful-booker.herokuapp.com")

@pytest.fixture
def auth_token(api_client):
    """
    Example of a nested fixture for Auth.
    """
    payload = {"username": "admin", "password": "password123"}
    response = api_client.post_auth(payload) # Assuming post_auth exists in client
    return response.json()["token"]

# HOOK: Custom Metadata for your JSON Report
def pytest_json_modifyreport(json_report):
    """
    Adds custom fields to your JSON report for the Unified Dashboard.
    """
    json_report['environment'] = 'Production/Staging'
    json_report['tester'] = 'FakeUser-CI'

@pytest.fixture
def booking_lifecycle(api_client):
    # 1. Setup
    booking_id = api_client.create_booking({...}).json()["bookingid"]
    yield booking_id # Provide ID to the test
    # 2. Teardown
    api_client.delete_booking(booking_id) # Clean up after test finishes