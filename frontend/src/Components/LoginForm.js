import React, { useState } from 'react';
import axios2 from '../services/axios2';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../styles/styles.css'; 

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reiniciar el estado de error cada vez que intentas loguearte

    if (username.trim() === '' || password.trim() === '') {
      setError('Por favor, llena todos los campos.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios2.post('token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Credenciales incorrectas. Inténtalo de nuevo.');
        } else {
          setError('Hubo un problema al intentar iniciar sesión. Inténtalo más tarde.');
        }
      } else {
        setError('Error de red. No se pudo conectar con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="form-container">
      <div className="login-image">
        <img src={require('../assets/taskmaster.jpeg')} alt="Login illustration" />
      </div>
      <div className="form">
        <h2 className="text-center">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </Form>
        <div className="extra-options mt-3 text-center">
          <p>
            ¿Olvidaste tu contraseña? <Link to="/recuperar-contrasena">Recuperar Contraseña</Link>
          </p>
          <p>
            ¿No estás registrado? <Link to="/register">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default LoginForm;
