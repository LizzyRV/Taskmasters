import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Container className="dashboard mt-5">
      <Row>
        <Col>
          {isAuthenticated ? (
            <>
              <h2>Bienvenido al Dashboard</h2>
              <p>Selecciona una opción del menú para comenzar a gestionar tus tareas.</p>
              <Link to="/tasks/create">
                <Button variant="primary" className="me-3">
                  Crear Tarea
                </Button>
              </Link>
              <Link to="/kanban">
                <Button variant="secondary">
                  Ver Tablero Kanban
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h2>Bienvenido a TaskMaster</h2>
              <p>Para gestionar tus tareas, por favor inicia sesión o regístrate.</p>
              <Link to="/login">
                <Button variant="primary" className="me-3">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">
                  Registrarse
                </Button>
              </Link>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
