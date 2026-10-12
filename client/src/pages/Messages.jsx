import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/useLanguage";

function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const canSend = ["admin", "noticeManager", "staff"].includes(user?.role);
  const [tab, setTab] = useState("inbox");
  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [recipientId, setRecipientId] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMessages = useCallback(async () => {
    try {
      const requests = [api.get("/messages/inbox")];
      if (canSend) {
        requests.push(
          api.get("/messages/sent"),
          api.get("/messages/recipients")
        );
      }
      const [inboxResponse, sentResponse, recipientsResponse] =
        await Promise.all(requests);
      setInbox(inboxResponse.data.messages || []);
      setSent(sentResponse?.data.messages || []);
      setRecipients(recipientsResponse?.data.members || []);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not load your messages."
      );
    } finally {
      setLoading(false);
    }
  }, [canSend]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const markAsRead = async (messageId) => {
    setError("");
    try {
      await api.put(`/messages/${messageId}/read`);
      setInbox((current) =>
        current.map((item) =>
          item._id === messageId
            ? { ...item, readAt: item.readAt || new Date().toISOString() }
            : item
        )
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not update message read status."
      );
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSending(true);
    try {
      await api.post("/messages", { recipientId, body });
      setBody("");
      setRecipientId("");
      setNotice("Message sent.");
      setLoading(true);
      await loadMessages();
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Could not send the message."
      );
    } finally {
      setSending(false);
    }
  };

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleString(language === "ne" ? "ne-NP" : "en-US")
      : "";
  const messages = tab === "inbox" ? inbox : sent;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate(user?.role === "admin" ? "/admin" : user?.role === "member" ? "/dashboard" : "/manager")}
          className="mb-5 rounded-lg border bg-white px-4 py-2 hover:bg-gray-50"
        >
          ← {t("Back to Dashboard")}
        </button>

        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">{t("Messages")}</h1>
          <p className="mt-2 text-slate-600">
            {t("Read private messages sent to your account.")}
          </p>
        </header>

        {error && (
          <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
            {t(error)}
          </p>
        )}
        {notice && (
          <p role="status" className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">
            {t(notice)}
          </p>
        )}

        {canSend && (
          <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-slate-900">
              {t("Send a Private Message")}
            </h2>
            <form onSubmit={sendMessage} className="space-y-4">
              <label className="block">
                <span className="mb-1 block font-medium text-slate-700">
                  {t("Select a member")}
                </span>
                <select
                  value={recipientId}
                  onChange={(event) => setRecipientId(event.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                >
                  <option value="">{t("Choose a member")}</option>
                  {recipients.map((recipient) => (
                    <option key={recipient._id} value={recipient._id}>
                      {recipient.name} ({recipient.email})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block font-medium text-slate-700">
                  {t("Message")}
                </span>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  maxLength={5000}
                  rows={4}
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3"
                />
              </label>
              <button
                type="submit"
                disabled={sending || recipients.length === 0}
                className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {sending ? t("Sending...") : t("Send Message")}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("inbox")}
              aria-pressed={tab === "inbox"}
              className={`rounded-lg px-4 py-2 font-medium ${tab === "inbox" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {t("Inbox")} ({inbox.filter((item) => !item.readAt).length} {t("unread")})
            </button>
            {canSend && (
              <button
                type="button"
                onClick={() => setTab("sent")}
                aria-pressed={tab === "sent"}
                className={`rounded-lg px-4 py-2 font-medium ${tab === "sent" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {t("Sent")}
              </button>
            )}
          </div>

          {loading ? (
            <p className="text-slate-500">{t("Loading messages...")}</p>
          ) : messages.length === 0 ? (
            <p className="text-slate-500">
              {t(tab === "inbox" ? "Your inbox is empty." : "No sent messages yet.")}
            </p>
          ) : (
            <div className="space-y-4">
              {messages.map((item) => (
                <article
                  key={item._id}
                  className={`rounded-xl border p-4 ${tab === "inbox" && !item.readAt ? "border-blue-200 bg-blue-50/50" : "border-slate-200"}`}
                >
                  <div className="flex flex-col justify-between gap-2 sm:flex-row">
                    <p className="font-semibold text-slate-900">
                      {tab === "inbox"
                        ? `${t("From")}: ${item.sender?.name || t("User")}`
                        : `${t("To")}: ${item.recipient?.name || t("Member")}`}
                    </p>
                    <time className="text-sm text-slate-500">
                      {formatDate(item.createdAt)}
                    </time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap break-words text-slate-700">
                    {item.body}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <span className={item.readAt ? "text-slate-500" : "font-semibold text-blue-700"}>
                      {t(item.readAt ? "Read" : "Unread")}
                    </span>
                    {tab === "inbox" && !item.readAt && (
                      <button
                        type="button"
                        onClick={() => markAsRead(item._id)}
                        className="font-semibold text-blue-700 underline"
                      >
                        {t("Mark as read")}
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Messages;
