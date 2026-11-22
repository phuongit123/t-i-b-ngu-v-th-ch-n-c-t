import { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth-context';

export default function ResetPasswordPage() {
  const { recovery, isConfigured, setNewPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <section className="mx-auto max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
      {complete ? <p role="status">Đã đổi mật khẩu. <a href="/" className="underline">Về trang chủ</a></p>
        : recovery ? (
          <form className="space-y-3" onSubmit={async event => {
            event.preventDefault();
            setSaving(true);
            try {
              const { error } = await setNewPassword(password);
              if (error) setError(error.message);
              else setComplete(true);
            } catch {
              setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
            } finally { setSaving(false); }
          }}>
            <label htmlFor="reset-password">Mật khẩu mới</label>
            <input id="reset-password" className="block w-full rounded border border-hairline bg-surface p-2"
              type="password" autoComplete="new-password" minLength={8} required
              value={password} onChange={event => setPassword(event.target.value)} />
            {error && <p role="alert">{error}</p>}
            <button type="submit" disabled={saving} className="rounded border border-hairline px-3 py-2">
              {saving ? 'Đang lưu…' : 'Lưu mật khẩu mới'}
            </button>
          </form>
        ) : <p role="status">{isConfigured ? 'Liên kết đã hết hạn hoặc không hợp lệ. Hãy yêu cầu liên kết mới.'
          : 'Khôi phục mật khẩu cần kết nối dịch vụ tài khoản.'}</p>}
    </section>
  );
}
