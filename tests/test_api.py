def test_health_check_is_not_protected(client):
    client.get('/logout')  # Make sure user is logged out.
    response = client.get('api/health-check')
    assert response.status_code == 200
