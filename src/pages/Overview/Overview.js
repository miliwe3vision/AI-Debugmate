import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FiUsers, FiSettings, FiMessageSquare, FiDatabase } from "react-icons/fi";

const Overview = () => {
  return (
    <Container
      fluid
      className="py-5 mt-5"
      style={{
        background: "linear-gradient(135deg, #eef5ff, #f8fbff, #e3f2fd)",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <Row className="mb-4 text-center">
        <Col>
          <h1
            className="fw-bold"
            style={{
              fontSize: "3rem",
              background: "linear-gradient(90deg,#007bff,#00c6ff,#6f42c1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Debugmate – Intelligent Project Assistant
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#555",
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            A centralized platform with AI-powered chatbots to manage projects,
            roles, and real-time support for employees.
          </p>
        </Col>
      </Row>

      {/* Feature Cards */}
      <Row className="g-4">
        {[
          {
            icon: <FiMessageSquare size={40} className="text-primary mb-3" />,
            title: "Dual Chatbots",
            text: (
              <>
                Get real-time help with a <b>General Chatbot</b> for coding &
                queries, and a <b>Project Chatbot</b> for role-based project
                details.
              </>
            ),
          },
          {
            icon: <FiUsers size={40} className="text-success mb-3" />,
            title: "Role-Based Access",
            text: (
              <>
                Admins & HR can manage projects and tasks, while employees view
                only their assigned work securely.
              </>
            ),
          },
          {
            icon: <FiDatabase size={40} className="text-warning mb-3" />,
            title: "Project Management",
            text: (
              <>
                Submit new projects, track deadlines, and view data in{" "}
                <b>table or card view</b> for better decisions.
              </>
            ),
          },
          {
            icon: <FiSettings size={40} className="text-danger mb-3" />,
            title: "Personalization",
            text: (
              <>
                Customize your profile, switch between{" "}
                <b>light & dark themes</b>, and get a tailored workspace
                experience.
              </>
            ),
          },
        ].map((card, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card
              className="h-100 shadow-sm"
              style={{
                borderRadius: "20px",
                border: "none",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "translateY(-10px) scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0) scale(1)")
              }
            >
              <Card.Body className="text-center">
                {card.icon}
                <Card.Title style={{ fontWeight: "700", fontSize: "1.3rem" }}>
                  {card.title}
                </Card.Title>
                <Card.Text style={{ color: "#444" }}>{card.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bottom CTA */}
      <Row className="mt-5 text-center">
        <Col>
          <h3 className="fw-bold">How Debugmate Works</h3>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#555",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Login securely → Explore projects in dashboard → Get instant chatbot
            help → Submit forms & feedback → Collaborate efficiently.
          </p>
          <Button
            size="lg"
            style={{
              borderRadius: "50px",
              padding: "1rem 3rem",
              fontWeight: "600",
              background:
                "linear-gradient(90deg,#007bff,#00c6ff,#6f42c1)",
              border: "none",
              transition: "all 0.4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Get Started
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Overview;
