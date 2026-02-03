import requests

class APIClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

    def create_booking(self, payload):
        return requests.post(f"{self.base_url}/booking", json=payload, headers=self.headers)

    def get_booking(self, booking_id):
        return requests.get(f"{self.base_url}/booking/{booking_id}", headers=self.headers)