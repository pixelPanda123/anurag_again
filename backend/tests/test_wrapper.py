from app.services.sarvam_wrapper import translate_text

print(
    translate_text(
        "This is a government notice.",
        "auto",
        "hi-IN"
    )
)
