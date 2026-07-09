import { useState, type FormEvent } from 'react';
import { supabase, type ContactMessageInput } from '../lib/supabase';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [form, setForm] = useState<ContactMessageInput>({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

  function update<K extends keyof ContactMessageInput>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'El nombre es obligatorio';
    if (form.name.length > 255) return 'El nombre es demasiado largo';
    if (!form.email.trim()) return 'El email es obligatorio';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'El email no es valido';
    if (form.phone && form.phone.length > 30) return 'El telefono es demasiado largo';
    if (form.country && form.country.length > 50) return 'El pais es demasiado largo';
    if (!form.message.trim()) return 'El mensaje es obligatorio';
    if (form.message.length > 2000) return 'El mensaje es demasiado largo (max 2000 caracteres)';
    return null;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setErrorMsg(validationError);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone?.trim() || null,
        country: form.country?.trim() || null,
        message: form.message.trim(),
        is_read: false,
      });

      if (error) throw error;

      setStatus('success');
      setForm({ name: '', email: '', phone: '', country: '', message: '' });
      // Auto-ocultar el mensaje tras 6 segundos
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : 'Error desconocido al enviar el mensaje';
      setErrorMsg(msg);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card bg-elevated"
      style={{ borderColor: 'var(--color-accent-ink)' }}
    >
      <h3 className="font-display text-xl font-extrabold mb-4">Envia tu mensaje</h3>

      {status === 'success' && (
        <div className="alert alert-success mb-4" role="status">
          Mensaje enviado con exito. Te contactaremos pronto.
        </div>
      )}

      {status === 'error' && (
        <div className="alert alert-error mb-4" role="alert">
          {errorMsg || 'Ocurrio un error. Intenta de nuevo.'}
        </div>
      )}

      <div className="grid-2 mb-4">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Nombre <span style={{ color: 'var(--color-accent-2)' }}>*</span>
          </label>
          <input
            className="form-input"
            id="name"
            name="name"
            type="text"
            placeholder="Tu nombre"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            maxLength={255}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">
            Email <span style={{ color: 'var(--color-accent-2)' }}>*</span>
          </label>
          <input
            className="form-input"
            id="email"
            name="email"
            type="email"
            placeholder="tu@email.com"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            maxLength={255}
          />
        </div>
      </div>

      <div className="grid-2 mb-4">
        <div className="form-group">
          <label className="form-label" htmlFor="phone">
            Telefono
          </label>
          <input
            className="form-input"
            id="phone"
            name="phone"
            type="tel"
            placeholder="+57 300 0000000"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            maxLength={30}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="country">
            Pais
          </label>
          <select
            className="form-input"
            id="country"
            name="country"
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">Selecciona tu pais</option>
            <option value="Colombia">Colombia</option>
            <option value="Venezuela">Venezuela</option>
          </select>
        </div>
      </div>

      <div className="form-group mb-6">
        <label className="form-label" htmlFor="message">
          Mensaje <span style={{ color: 'var(--color-accent-2)' }}>*</span>
        </label>
        <textarea
          className="form-textarea"
          id="message"
          name="message"
          placeholder="Cuentanos sobre tu negocio, que necesitas automatizar..."
          required
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          maxLength={2000}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-full"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? (
          <>
            <span className="loading-spinner" /> Enviando...
          </>
        ) : (
          <>
            Enviar mensaje <span style={{ fontSize: '1.2em' }}>&#8594;</span>
          </>
        )}
      </button>
    </form>
  );
}
