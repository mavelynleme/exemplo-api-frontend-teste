import React, { useState, useEffect } from 'react';
import './App.css'; // Importa o arquivo CSS

const API_URL = 'https://express-crud-json.onrender.com/api/notes';

function App() {
  const [notas, setNotas] = useState([]);
  const [form, setForm] = useState({ titulo: '', texto: '', id: null });

  useEffect(() => {
    fetchNotas();
  }, []);

  const fetchNotas = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setNotas(data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo || !form.texto) return;

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_URL}/${form.id}` : API_URL;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: form.titulo, texto: form.texto })
    });

    if (res.ok) {
      setForm({ titulo: '', texto: '', id: null });
      fetchNotas();
    }
  };

  const handleEdit = (nota) => {
    setForm({ titulo: nota.titulo, texto: nota.texto, id: nota.id });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchNotas();
  };

  return (
    <div className="container">
      <h1>Notas</h1>
      
      <form onSubmit={handleSubmit} className="form">
        <input
          name="titulo"
          placeholder="Título"
          value={form.titulo}
          onChange={handleChange}
          required
          className="input"
        />
        <textarea
          name="texto"
          placeholder="Texto"
          value={form.texto}
          onChange={handleChange}
          required
          className="textarea"
        />
        <button type="submit" className="button">
          {form.id ? 'Atualizar Nota' : 'Criar Nota'}
        </button>
      </form>

      <div className="notas-grid">
        {notas.map((nota) => (
          <div key={nota.id} className="nota">
            <strong>{nota.titulo}</strong>
            <p>{nota.texto}</p>
            <small>{new Date(nota.criadoEm).toLocaleString()}</small>
            <div>
              <button onClick={() => handleEdit(nota)} className="button">
                Editar
              </button>
              <button onClick={() => handleDelete(nota.id)} className="button nota-delete">
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
