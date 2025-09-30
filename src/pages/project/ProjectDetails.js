import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar, Button, ListGroup } from 'react-bootstrap';
import { FiCalendar, FiUsers, FiClock, FiUser, FiCode, FiFileText, FiArrowLeft, FiEdit, FiTrash2, FiArrowUp } from 'react-icons/fi';
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

  useEffect(() => {
    fetchProjectDetails();
    
    // Add scroll event listener
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const projectData = await projectDatabaseSupabase.getProjectById(id);
      if (projectData) {
        setProject(projectData);
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
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

  const getProgressValue = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 100;
      case 'in progress': return 60;
      case 'on hold': return 30;
      case 'not started': return 0;
      default: return 0;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 'No deadline';
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    return `${diffDays} days left`;
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      try {
        const result = await projectDatabaseSupabase.deleteProject(id);
        if (result.success) {
          navigate('/dashboard');
        } else {
          alert('Failed to delete project: ' + result.message);
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="project-details-container">
        <Container className="mt-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-details-container">
        <Container className="mt-5">
          <div className="text-center">
            <h3>Project Not Found</h3>
            <p className="text-muted">{error || 'The requested project could not be found.'}</p>
            <Link to="/dashboard" className="btn btn-primary">
              <FiArrowLeft className="me-2" />
              Back to Dashboard
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // Handle both database field names and form field names
  const projectName = project.project_name || project.projectName || 'Untitled Project';
  const projectDescription = project.project_description || project.projectDescription || '';
  const startDate = project.start_date || project.startDate;
  const endDate = project.end_date || project.endDate;
  const status = project.status || 'Not Started';
  const assignedTo = project.assigned_to || project.assignedTo || [];
  const techStack = project.tech_stack || project.techStack || [];
  const clientName = project.client_name || project.clientName || '';
  const leaderOfProject = project.leader_of_project || project.leaderOfProject || '';
  const projectScope = project.project_scope || project.projectScope || '';
  const roles = project.role || [];
  const roleAnswers = project.role_answers || project.roleAnswers || {};
  const customQuestions = project.custom_questions || project.customQuestions || [];
  const customAnswers = project.custom_answers || project.customAnswers || {};
  const projectResponsibility = project.project_responsibility || project.projectResponsibility || '';

  return (
    <div className="project-details-container">
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/dashboard" className="btn btn-outline-secondary">
            <FiArrowLeft className="me-2" />
            Back to Dashboard
          </Link>
          <div>
            <Link to={`/project/edit/${id}`} className="btn btn-primary me-2">
              <FiEdit className="me-2" />
              Edit Project
            </Link>
            <Button variant="danger" onClick={handleDeleteProject}>
              <FiTrash2 className="me-2" />
              Delete
            </Button>
          </div>
        </div>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h2 className="mb-2">{projectName}</h2>
                  <Badge bg={getStatusColor(status)} className="mb-3">
                    {status}
                  </Badge>
                </div>
                <Link 
                  to="/chatbot/WorkChat" 
                  state={{ projectId: id, projectName: projectName }}
                  className="btn btn-primary"
                >
                  Create New Chat
                </Link>
              </div>

              {projectDescription && (
                <div className="mb-4">
                  <h5>Description</h5>
                  <p className="text-muted">{projectDescription}</p>
                </div>
              )}

              {projectScope && (
                <div className="mb-4">
                  <h5>Project Scope</h5>
                  <p className="text-muted">{projectScope}</p>
                </div>
              )}

              <Row className="mb-4">
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <FiCalendar className="me-2 text-muted" />
                    <span className="fw-bold">Start Date:</span>
                    <span className="ms-2">{formatDate(startDate)}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <FiCalendar className="me-2 text-muted" />
                    <span className="fw-bold">End Date:</span>
                    <span className="ms-2">{formatDate(endDate)}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <FiClock className="me-2 text-muted" />
                    <span className="fw-bold">Deadline:</span>
                    <span className="ms-2">{calculateDaysLeft(endDate)}</span>
                  </div>
                </Col>
                {clientName && (
                  <Col md={6}>
                    <div className="d-flex align-items-center mb-2">
                      <FiUser className="me-2 text-muted" />
                      <span className="fw-bold">Client:</span>
                      <span className="ms-2">{clientName}</span>
                    </div>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Team Information</h5>
              
              {leaderOfProject && (
                <div className="mb-3">
                  <h6>Project Leader</h6>
                  <p className="text-muted mb-0">{leaderOfProject}</p>
                </div>
              )}

              {assignedTo && assignedTo.length > 0 && (
                <div className="mb-3">
                  <h6>Team Members ({assignedTo.length})</h6>
                  <ListGroup variant="flush">
                    {assignedTo.map((member, index) => (
                      <ListGroup.Item key={index} className="px-0">
                        <FiUsers className="me-2 text-muted" />
                        {member}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}

              {projectResponsibility && (
                <div className="mb-3">
                  <h6>Project Responsibility</h6>
                  <p className="text-muted mb-0">{projectResponsibility}</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {techStack && techStack.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <FiCode className="me-2" />
                  Technology Stack
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <Badge key={index} bg="light" text="dark">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {roles && roles.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">
                  <FiFileText className="me-2" />
                  Project Roles
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {roles.map((role, index) => (
                    <Badge key={index} bg="info">
                      {role}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {(Object.keys(roleAnswers).length > 0 || customQuestions.length > 0) && (
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Project Questions & Answers</h5>
                
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
                          <div className="text-muted">{customAnswers[question] || 'No answer provided'}</div>
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
      </Container>
      
      {/* Scroll to Top Button */}
      <button 
        className={`scroll-to-top-btn ${showScrollTop ? 'show' : ''}`}
        onClick={scrollToTop}
        title="Scroll to top"
      >
        <FiArrowUp />
      </button>
    </div>
  );
};

export default ProjectDetails;
