from app.sarvam_client import client

response = client.text.translate(
    input="This is a government notice regarding land ownership.",
    source_language_code="auto",
    target_language_code="hi-IN"
)

print(response)
