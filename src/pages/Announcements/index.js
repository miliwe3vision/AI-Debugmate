import { useMessages } from "../../contexts/messagecontext";
import { Card, Badge, Table, Container } from "react-bootstrap";

const Announcements = () => {
  const { messages } = useMessages();

  return (
    <Container fluid className="p-4" style={{ marginTop: "90px" }}>
      <h2 className="fw-bold mb-4 text-primary">📢 Company Announcements</h2>

      {Object.keys(messages).length === 0 ? (
        <p className="text-muted">No announcements yet.</p>
      ) : (
        Object.entries(messages).map(([email, msgs]) => (
          <Card key={email} className="mb-4 shadow-sm border-0">
            <Card.Header className="bg-dark text-white fw-bold">
              Announcements for <span className="text-warning">{email}</span>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Message / Task</th>
                    <th>Sender</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {msgs.map((msg, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{msg.text}</td>
                      <td>
                        <Badge
                          bg={msg.sender === "Leader" ? "success" : "secondary"}
                        >
                          {msg.sender}
                        </Badge>
                      </td>
                      <td className="small text-muted">{msg.time}</td>
                      <td>
                        {msg.text.startsWith("📌 Task") ? (
                          <Badge bg="warning">Task Assigned</Badge>
                        ) : (
                          <Badge bg="info">Message</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Announcements;
