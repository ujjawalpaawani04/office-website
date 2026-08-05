"""Covers calendly_client.map_calendly_location - the single place Calendly's
raw `location` object (on a scheduled event) is turned into the three
columns the admin panel's Appointment Mode feature actually renders
(appointment_mode, location_detail, meeting_link). Shared by both write
paths into the appointments table (embed backfill via fetch_event_details,
and the manual sync in appointment_sync_service.py), so a regression here
would silently break the mode/Call/Join Meeting behavior on both.
"""
from app.services.calendly_client import map_calendly_location


def test_outbound_call_maps_to_phone_with_the_invitee_number():
    result = map_calendly_location({"type": "outbound_call", "location": "+91 98765 43210"})

    assert result == {"mode": "phone", "location_detail": "+91 98765 43210", "meeting_link": None}


def test_inbound_call_also_maps_to_phone():
    result = map_calendly_location({"type": "inbound_call", "location": "+91 90000 00000"})

    assert result["mode"] == "phone"


def test_physical_maps_to_in_person_with_the_address():
    result = map_calendly_location({"type": "physical", "location": "123 MG Road, Bengaluru"})

    assert result == {"mode": "in_person", "location_detail": "123 MG Road, Bengaluru", "meeting_link": None}


def test_zoom_maps_to_zoom_with_the_join_url():
    result = map_calendly_location({"type": "zoom", "join_url": "https://zoom.us/j/123456789"})

    assert result == {"mode": "zoom", "location_detail": None, "meeting_link": "https://zoom.us/j/123456789"}


def test_google_meet_falls_back_to_other_but_keeps_the_join_link():
    result = map_calendly_location({"type": "google_conference", "join_url": "https://meet.google.com/abc-defg-hij"})

    assert result["mode"] == "other"
    assert result["meeting_link"] == "https://meet.google.com/abc-defg-hij"
    assert result["location_detail"] is None


def test_missing_location_type_maps_to_none_not_other():
    # No "type" key at all (e.g. an empty/unresolved location) is distinct
    # from a real-but-unrecognized Calendly type ("other") - the admin panel
    # renders both as "-", but keeping them distinct in the data leaves room
    # to tell "Calendly hasn't told us yet" apart from "some type we don't
    # specifically handle" if that's ever needed.
    result = map_calendly_location({})

    assert result["mode"] is None


def test_none_location_does_not_raise():
    result = map_calendly_location(None)

    assert result == {"mode": None, "location_detail": None, "meeting_link": None}
