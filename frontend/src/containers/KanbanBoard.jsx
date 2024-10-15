import React, { useState, useEffect } from 'react';
import axios2 from '../services/axios2';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import '../styles/styles.css';

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expiration_date: '',
    priority: '',
    status: '',
    category: '',
  });

  // Obtener la lista de tareas
  const fetchTasks = async () => {
    try {
      const response = await axios2.get('taskmaster/tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error('Error al obtener las tareas', error);
    }
  };

  // Obtener la lista de categorías
  const fetchCategories = async () => {
    try {
      const response = await axios2.get('taskmaster/categories/');
      setCategories(response.data);
    } catch (error) {
      console.error('Error al obtener las categorías', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCategories();
  }, []);

  const handleShowModal = (task) => {
    setSelectedTask(task);
    
    const expirationDate = task.expiration_date
      ? task.expiration_date.substring(0, 16) // Asegurar que se use el formato "YYYY-MM-DDThh:mm"
      : '';
  
    setFormData({
      name: task.name,
      description: task.description,
      expiration_date: expirationDate,
      priority: task.priority,
      status: task.status,
      category: task.category,
    });
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      await axios2.put(`taskmaster/tasks/${selectedTask.id}/`, formData);
      setTasks(tasks.map(task => (task.id === selectedTask.id ? { ...task, ...formData } : task)));
      setShowModal(false);
      fetchTasks(); // Actualizar las tareas después de guardar los cambios
    } catch (error) {
      console.error('Error al actualizar la tarea', error);
    }
  };

  const handleChangeStatus = async (task, newStatus) => {
    try {
      await axios2.put(`taskmaster/tasks/${task.id}/`, { ...task, status: newStatus });
      setTasks(tasks.map(t => (t.id === task.id ? { ...t, status: newStatus } : t)));
      fetchTasks(); // Actualizar las tareas después de cambiar el estado
    } catch (error) {
      console.error('Error al cambiar el estado de la tarea', error);
    }
  };

  // Filtrar tareas según la categoría seleccionada
  const tasksByCategory = () => {
    return tasks.filter((task) => {
      return filterCategory ? task.category === parseInt(filterCategory) : true;
    });
  };

  // Manejar el cambio de filtro de categoría
  const handleFilterCategoryChange = (e) => {
    setFilterCategory(e.target.value);
  };

  // Mostrar prioridad legible en lugar de las abreviaturas
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'P':
        return 'Prioritaria';
      case 'R':
        return 'Requiere seguimiento';
      case 'N':
        return 'No prioritaria';
      default:
        return priority;
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">Tablero Kanban</h2>
      
      {/* Filtro de Categoría */}
      <Form.Group controlId="formFilterCategory" className="mb-3">
        <Form.Label>Filtrar por Categoría</Form.Label>
        <Form.Select value={filterCategory} onChange={handleFilterCategoryChange}>
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Tablero Kanban */}
      <div className="kanban-board">
        {['Pendiente', 'En progreso', 'Completada'].map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {tasksByCategory().filter(task => task.status === status).map((task) => (
              <div key={task.id} className="kanban-task">
                <h5 style={{ textAlign: 'center' }}>{task.name} </h5>

                
                <p><strong>Descripción: </strong> {task.description}</p>
                <p><strong>Vencimiento:</strong> {task.expiration_date}</p>
                <p><strong>Creado en:</strong> {task.created}</p>
                <p><strong>Prioridad:</strong> {getPriorityDisplay(task.priority)}</p>
                <p><strong>Categoría:</strong> {categories.find((category) => category.id === task.category)?.name || 'Sin categoría'}</p>
                <div className="task-actions">
                  <Button variant="info" size="sm" onClick={() => handleShowModal(task)}>
                    Ver/Editar
                  </Button>
                  {status !== 'Completada' && (
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleChangeStatus(task, status === 'Pendiente' ? 'En progreso' : 'Completada')}
                    >
                      {status === 'Pendiente' ? 'Mover a En progreso' : 'Mover a Completada'}
                    </Button>
                  )}
                  {status === 'En progreso' && (
                    <Button
                      variant="warning"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleChangeStatus(task, 'Pendiente')}
                    >
                      Mover a Pendiente
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Modal para ver/editar tarea */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ver/Editar Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Nombre de la Tarea</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
              />
            </Form.Group>
            <Form.Group controlId="formExpirationDate" className="mb-3">
              <Form.Label>Fecha de Vencimiento</Form.Label>
              <Form.Control
                type="datetime-local"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPriority" className="mb-3">
              <Form.Label>Prioridad</Form.Label>
              <Form.Select name="priority" value={formData.priority} onChange={handleFormChange}>
                <option value="P">Prioritaria</option>
                <option value="R">Requiere seguimiento</option>
                <option value="N">No prioritaria</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formStatus" className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select name="status" value={formData.status} onChange={handleFormChange}>
                <option value="Pendiente">Pendiente</option>
                <option value="En progreso">En progreso</option>
                <option value="Completada">Completada</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default KanbanBoard;
