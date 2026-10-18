import { useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../auth";
import { supabase } from "../lib/supabase";
import "./FeedbackForm.css";

type FeedbackFormProps = {
  onClose: () => void;
};

const FeedbackForm = ({ onClose }: FeedbackFormProps) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [invalid, setInvalid] = useState(false);
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      setInvalid(true);
      setError("Enter your feedback.");
      return;
    }

    if (!supabase || !user) {
      setError("Log in before sending feedback.");
      return;
    }

    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("feedback").insert({
      message: text,
      user_id: user.id,
      user_email: user.email,
    });

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onClose();
  };

  return createPortal(
    <div className="feedback-backdrop" onClick={onClose}>
      <form
        className="feedback-sheet"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <h2>Feedback</h2>
        <textarea
          className={invalid ? "invalid" : undefined}
          placeholder="Write your feedback"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            setInvalid(false);
          }}
        />
        {error && <p className="feedback-error">{error}</p>}
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>
    </div>,
    document.querySelector(".mobile") ?? document.body,
  );
};

export default FeedbackForm;
