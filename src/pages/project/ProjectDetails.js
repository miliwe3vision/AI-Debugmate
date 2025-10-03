import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Modal, Table, Accordion } from 'react-bootstrap';
import { 
  FiCalendar, FiClock, FiUser, FiCode, FiFileText, 
  FiArrowLeft, FiArrowUp, FiUsers 
} from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import projectDatabaseSupabase from '../../services/projectDatabaseSupabase';
import './projectDetailsTable.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const roleAnswers = project?.role_answers ?? project?.roleAnswers ?? {};
  const customQuestions = project?.custom_questions ?? project?.customQuestions ?? [];
  const customAnswers = project?.custom_answers ?? project?.customAnswers ?? {};
  

  useEffect(() => {
    fetchProjectDetails();
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await projectDatabaseSupabase.getProjectById(id);
      setProject(projectData || null);
      if (!projectData) setError('Project not found');
    } catch (error) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'primary';
      case 'on hold': return 'warning';
      case 'not started': return 'secondary';
      default: return 'info';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 'No deadline';
    const end = new Date(endDate);
    const today = new Date();
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days left`;
  };

  if (loading) {
    return (
      <div className="project-details-container text-center mt-5">
        <div className="spinner-border" role="status"></div>
        <p className="text-muted mt-2">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Container className="text-center mt-5">
        <Card className="p-4 shadow-sm">
          <h3 className="mb-2">Project Not Found</h3>
          <p className="text-muted">{error}</p>
          <Link to="/dashboard" className="btn btn-primary">
            <FiArrowLeft className="me-2" /> Back to Dashboard
          </Link>
        </Card>
      </Container>
    );
  }

  // Extract project details safely
  const projectName = project.project_name || project.projectName || 'Untitled Project';
  const projectDescription = project.project_description || project.projectDescription || '';
  const startDate = project.start_date || project.startDate;
  const endDate = project.end_date || project.endDate;
  const status = project.status || 'Not Started';
  const techStack = project.tech_stack || project.techStack || [];
  const clientName = project.client_name || project.clientName || '';
  const leaderOfProject = project.leader_of_project || project.leaderOfProject || '';
  const projectScope = project.project_scope || project.projectScope || '';
  const projectResponsibility = project.project_responsibility || project.projectResponsibility || '';

// Use teamAssignments stored in the project

let teamMembers = [];

// ✅ New format (camelCase or snake_case)
if ((project.teamAssignments && project.teamAssignments.length > 0) || 
    (project.team_assignments && project.team_assignments.length > 0)) {
  
  const assignments = project.teamAssignments || project.team_assignments;

  teamMembers = assignments.map(m => ({
    email: m.email,
    roles: m.roles || []
  }));
}
// ✅ Old format fallback
else if (project.assigned_to_emails && project.assigned_role) {
  teamMembers = project.assigned_to_emails.map((email, idx) => ({
    email,
    roles: Array.isArray(project.assigned_role[idx])
      ? project.assigned_role[idx]
      : [project.assigned_role[idx]]
  }));
}



  return (
    <div className="project-details-container">
      <Container className="mt-4 mb-5">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/dashboard" className="btn btn-outline-secondary">
            <FiArrowLeft className="me-2" /> Back
          </Link>
          <Badge bg={getStatusColor(status)} className="px-3 py-2 fs-6">{status}</Badge>
        </div>

        <Row>
          {/* Left: Project Info */}
          <Col lg={8}>
            <Card className="shadow-sm mb-4">
              <Card.Body>
                <h2 className="fw-bold mb-3">{projectName}</h2>
                {projectDescription && <p className="text-muted">{projectDescription}</p>}
                {projectScope && <p className="fst-italic">{projectScope}</p>}

                <hr />
                <Row>
                  <Col md={6} className="mb-3">
                    <FiCalendar className="me-2 text-primary" /> 
                    <strong>Start:</strong> {formatDate(startDate)}
                  </Col>
                  <Col md={6} className="mb-3">
                    <FiCalendar className="me-2 text-danger" /> 
                    <strong>End:</strong> {formatDate(endDate)}
                  </Col>
                  <Col md={6} className="mb-3">
                    <FiClock className="me-2 text-warning" /> 
                    <strong>Deadline:</strong> {calculateDaysLeft(endDate)}
                  </Col>
                  {clientName && (
                    <Col md={6} className="mb-3">
                      <FiUser className="me-2 text-info" /> 
                      <strong>Client:</strong> {clientName}
                    </Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Right: Team & Tech */}
          <Col lg={4}>
  <Card className="shadow-sm mb-4">
    <Card.Body>
      <h5><FiUsers className="me-2" /> Team</h5>
      {leaderOfProject && <p><strong>Leader:</strong> {leaderOfProject}</p>}
      <div>
  {project.assigned_to_emails && project.assigned_to_emails.length > 0 ? (
    project.assigned_to_emails.slice(0, 3).map((email, idx) => (
      <p key={idx} className="text-muted small mb-1">
        👤 {email} ({project.assigned_role[idx] || "No role"})
      </p>
    ))
  ) : (
    <p className="text-muted small">No team members assigned</p>
  )}
  {project.assigned_to_emails && project.assigned_to_emails.length > 3 && (
    <p className="small text-muted">
      +{project.assigned_to_emails.length - 3} more...
    </p>
  )}
</div>


      <Button size="sm" variant="outline-primary" onClick={() => setShowTable(true)}>
        View Details
      </Button>
    </Card.Body>
  </Card>

  {techStack.length > 0 && (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h5><FiCode className="me-2" /> Tech Stack</h5>
        <div className="d-flex flex-wrap gap-2">
          {techStack.map((tech, i) => (
            <Badge key={i} bg="light" text="dark">{tech}</Badge>
          ))}
        </div>
      </Card.Body>
    </Card>
  )}
</Col>

        </Row>

        {/* Responsibility */}
        {projectResponsibility && (
          <Card className="shadow-sm mt-3">
            <Card.Body>
              <h5><FiFileText className="me-2" /> Responsibility</h5>
              <p className="text-muted">{projectResponsibility}</p>
            </Card.Body>
          </Card>
        )}
      </Container>
     
      {(Object.keys(roleAnswers).length > 0 || customQuestions.length > 0) && (
  <Row className='mb-10'>
    <Col>
      <Card>
        <Card.Body>
          {/* Change the card title here */}
          <h5 className="mb-3">Project Q&A</h5>

          {Object.keys(roleAnswers).length > 0 && (
            <div className="mb-4">
              <h6>Role-based Questions</h6>
              <ListGroup variant="flush">
                {Object.entries(roleAnswers).map(([question, answer]) => (
                  <ListGroup.Item key={question} className="px-0">
                    <div className="fw-bold mb-1">{question}</div>
                    <div className="text-muted">{answer}</div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}

          {customQuestions.length > 0 && (
            <div>
              <h6>Custom Questions</h6>
              <ListGroup variant="flush">
                {customQuestions.map((question, index) => (
                  <ListGroup.Item key={index} className="px-0">
                    <div className="fw-bold mb-1">{question}</div>
                    <div className="text-muted">
                      {customAnswers[question] || 'No answer provided'}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
    </Col>
  </Row>
)}



{/* Team Modal */}
<Modal show={showTable} onHide={() => setShowTable(false)} size="lg" centered>
  <Modal.Header closeButton>
    <Modal.Title>Team Members & Roles</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  {project.assigned_to_emails && project.assigned_to_emails.length > 0 ? (
    project.assigned_to_emails.map((email, idx) => (
      <tr key={idx}>
        <td>{idx + 1}</td>
        <td>{email}</td>
        <td>
          {Array.isArray(project.assigned_role) 
            ? project.assigned_role[idx] || "No role" 
            : "No role"}
        </td>
        <td>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/chat/${email}`)}
          >
            Chat
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center text-muted">
        No team members assigned
      </td>
    </tr>
  )}
</tbody>

    </Table>
  </Modal.Body>
</Modal>



      {/* Scroll to Top */}
      <button 
        className={`scroll-to-top-btn ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
      >
        <FiArrowUp />
      </button>
    </div>
  );
};

export default ProjectDetails;
