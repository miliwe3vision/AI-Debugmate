import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Overview = () => {
  const featureCards = [
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
          height="40"
          width="40"
          style={{ color: "#0d6efd" }} // primary blue
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      title: "Dual Chatbots",
      text: (
        <>
          Get real-time help with a <b>General Chatbot</b> for coding & queries, and a <b>Project Chatbot</b> for role-based project details.
        </>
      ),
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
          height="40"
          width="40"
          style={{ color: "#198754" }} // success green
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "Role-Based Access",
      text: (
        <>
          Admins & HR can manage projects and tasks, while employees view only their assigned work securely.
        </>
      ),
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
          height="40"
          width="40"
          style={{ color: "#ffc107" }} // warning yellow
        >
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      ),
      title: "Project Management",
      text: (
        <>
          Submit new projects, track deadlines, and view data in <b>table or card view</b> for better decisions.
        </>
      ),
    },
    {
      icon: (
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-3"
          height="40"
          width="40"
          style={{ color: "#dc3545" }} // danger red
        >
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      ),
      title: "Personalization",
      text: (
        <>
          Customize your profile, switch between <b>light & dark themes</b>, and get a tailored workspace experience.
        </>
      ),
    },
  ];

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
              background: "linear-gradient(135deg, #A80C4C, #090939, #421256, #531C9B)",
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
        {featureCards.map((card, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card
              className="h-100 shadow-sm text-center"
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
              <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                {card.icon}
                <Card.Title style={{ fontWeight: "700", fontSize: "1.3rem" }}>
                  {card.title}
                </Card.Title>
                <Card.Text style={{ color: "#444", textAlign: "center" }}>
                  {card.text}
                </Card.Text>
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
                "linear-gradient(135deg, #A80C4C, #090939, #421256, #531C9B)",
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
