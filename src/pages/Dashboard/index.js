import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { FiPlus, FiRefreshCw, FiArrowUp } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import projectDatabaseSupabase from '../../services/projectDatabaseSupabase';
import { MyContext } from '../../App';
import './Dashboard.css';

const StatCard = ({ value, title, icon }) => (
  <div className="stat-card-custom d-flex flex-column align-items-center justify-content-center">
    {icon && <div className="mb-2">{icon}</div>}
    <div className="stat-value">{value}</div>
    <div className="stat-title">{title}</div>
  </div>
);

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(MyContext);
  const userEmail = context.userEmail;

  // 🔒 Redirect if not logged in
  useEffect(() => {
    if (!userEmail) {
      navigate('/signin');
    }
  }, [userEmail, navigate]);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [stats, setStats] = useState({
    openProjects: 0,
    completedProjects: 0,
    totalHours: 0,
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);

  // Detect dark mode for color styling
  useEffect(() => {
    const checkDarkMode = () =>
      setDarkMode(document.body.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const fetchProjects = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const projectsData = await projectDatabaseSupabase.getAllProjects();
      setProjects(projectsData || []);
      const openProjects = projectsData.filter(
        (p) => p.status?.toLowerCase() !== 'completed'
      ).length;
      const completedProjects = projectsData.filter(
        (p) => p.status?.toLowerCase() === 'completed'
      ).length;
      setStats({
        openProjects,
        completedProjects,
        totalHours: projectsData.length * 8,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (location.state?.refreshProjects) {
      fetchProjects();
      setShowSuccessAlert(true);
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    }
  }, [location.state]);

  useEffect(() => {
    const dashboardContainer = document.querySelector('.dashboard-container');
    const handleScroll = () => {
      if (dashboardContainer)
        setShowScrollTop(dashboardContainer.scrollTop > 300);
    };
    if (dashboardContainer) {
      dashboardContainer.addEventListener('scroll', handleScroll);
      return () =>
        dashboardContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer)
      dashboardContainer.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Color backgrounds for cards based on theme
  const getRandomCardColor = (index) => {
    if (darkMode) {
      const darkColors = [
        'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #533483)',
      ];
      return darkColors[index % darkColors.length];
    } else {
      const colors = [
        '#fff9c4',
        '#bbdefb',
        '#ffcdd2',
        '#c8e6c9',
        '#ffe0b2',
      ];
      return colors[index % colors.length];
    }
  };

  // Format project date for the date tag shown on each card
  const formatProjectDate = (project) => {
    const rawDate =
      project?.createdAt ||
      project?.created_at ||
      project?.start_date ||
      project?.startDate;
    if (!rawDate) return '';
    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const filteredProjects = projects.filter((project) => {
    if (statusFilter === 'all') return true;
    return (
      (project.status || 'Not Started').toLowerCase() ===
      statusFilter.toLowerCase()
    );
  });

  return (
    <Container fluid className="dashboard-container">
      {showSuccessAlert && (
        <Alert
          variant="success"
          onClose={() => setShowSuccessAlert(false)}
          dismissible
          className="mb-3"
        >
          <strong>Success!</strong> Your project has been created successfully
          and is now visible in the dashboard.
        </Alert>
      )}

      <Row className="g-8 mb-4 justify-content-center">
        <Col md={3} sm={6} xs={12}>
          <StatCard
            value={stats.openProjects.toString()}
            title="Open Projects"
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard
            value={stats.completedProjects.toString()}
            title="Completed Projects"
          />
        </Col>
        <Col md={3} sm={6} xs={12}>
          <StatCard
            value={stats.totalHours.toFixed(2)}
            title="Total Project Hours"
          />
        </Col>
      </Row>

      <Row>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-4 text-muted">
            No projects found. Create your first project to get started.
            <div className="d-flex justify-content-center gap-2 mt-3">
              <Button
                variant="outline-primary"
                onClick={() => fetchProjects(true)}
                disabled={refreshing}
              >
                <FiRefreshCw
                  className={refreshing ? 'spinning me-2' : 'me-2'}
                />
                {refreshing ? 'Refreshing...' : 'Refresh Projects'}
              </Button>
              <Link to="/project" className="btn btn-primary">
                <FiPlus className="me-2" />
                Create New Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="debug-section-card">
            <div className="debug-header d-flex justify-content-between align-items-center mb-3">
              <h6>All Projects ({filteredProjects.length})</h6>
              <div className="d-flex align-items-center gap-3">
                <select
                  className="status-dropdown"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="not started">Not Started</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </select>
                <Link
                  to="/project"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <FiPlus className="me-2" />
                  New Project
                </Link>
              </div>
            </div>
            <div className="debug-projects-grid">
              {filteredProjects.map((project, index) => (
                <Card
                  key={project.id}
                  className="project-card-custom mb-3"
                  style={{
                    background: getRandomCardColor(index),
                    borderRadius: '12px',
                  }}
                >
                  <Card.Body>
                    <div className="date-tag mb-2">
                      {formatProjectDate(project)}
                    </div>
                    <Card.Title className="project-title">
                      {project.project_name || project.projectName}
                    </Card.Title>
                    <Card.Text className="project-desc">
                      {project.project_description ||
                        project.projectDescription ||
                        'No description available'}
                    </Card.Text>
                    <div className="btn-container">
                      <Button
                        as={Link}
                        to={`/project/${project.id}`}
                        variant="outline-secondary"
                        size="sm"
                        className="view-details-pill"
                      >
                        View Details
                      </Button>
                      <Button
                        as={Link}
                        to="/chatbot/WorkChat"
                        state={{
                          projectId: project.id,
                          projectName:
                            project.project_name || project.projectName,
                        }}
                        variant="primary"
                        size="sm"
                        className="create-chat-btn"
                      >
                        Create Chat
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Row>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          variant="primary"
          size="sm"
          title="Scroll to top"
        >
          <FiArrowUp />
        </Button>
      )}
    </Container>
  );
};

export default Dashboard;
