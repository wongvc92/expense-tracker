import { useGetSessions } from "@/hooks/auth/useGetSessions";
import SubmitButton from "../common/submit-button";
import { useLogoutDevice } from "@/hooks/auth/useLogoutDevice";

const Sessions = () => {
  const { data, error } = useGetSessions();
  const { mutate, isPending } = useLogoutDevice();
  if (!data) {
    return <div>No data yet</div>;
  }
  return (
    <div>
      <h2>Active Sessions</h2>
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <ul>
        {data.map((session) => (
          <li key={session.id}>
            <p>
              <strong>Session Key:</strong> {session.sessionKey}
            </p>
            <p>
              <strong>User Agent:</strong> {session.userAgent}
            </p>
            <p>
              <strong>IP Address:</strong> {session.ipAddress}
            </p>
            <p>
              <strong>Created At:</strong> {new Date(session.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Expires At:</strong> {new Date(session.expiresAt).toLocaleString()}
            </p>
            <p>
              <strong>Revoked:</strong> {session.isRevoked ? "Yes" : "No"}
            </p>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                mutate(session.sessionKey);
              }}
            >
              <SubmitButton defaultTitle="logout" isLoading={isPending} />
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sessions;
