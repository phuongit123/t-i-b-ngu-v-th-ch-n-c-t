import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Lock, Mail, User, Shield, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/supabase/auth-context';
import type { UserRole } from '@/types/database.types';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'signin',
}) => {
  const {
    user,
    profile,
    role,
    isConfigured,
    signInWithPassword,
    signUp,
    signOut,
    resetPasswordForEmail,
    setLocalOfflineUser,
  } = useAuth();

  const showDemoSwitcher = !isConfigured && import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'forgot'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [careerTrack, setCareerTrack] = useState('Thiết kế Vector & Nhận diện thương hiệu');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const { error } = await signInWithPassword(email, password);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(isConfigured ? 'Đăng nhập thành công!' : 'Đã mở hồ sơ trên thiết bị này.');
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const { error, confirmationRequired } = await signUp(email, password, displayName, careerTrack);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (confirmationRequired) {
        setSuccessMsg('Kiểm tra email để xác nhận tài khoản trước khi đăng nhập.');
        return;
      }
      setSuccessMsg(isConfigured ? 'Tài khoản đã tạo thành công!' : 'Đã tạo hồ sơ trên thiết bị này.');
      setTimeout(() => {
        onClose();
      }, 900);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    const { error } = await resetPasswordForEmail(email);
    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg('Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư.');
    }
  };

  const handleMockRoleSwitch = (newRole: UserRole) => {
    setLocalOfflineUser(newRole, `demo_${newRole}@affinity.academy`, `Chuyên Gia ${newRole.toUpperCase()}`);
    setSuccessMsg(`Đã chuyển đổi sang vai trò: ${newRole.toUpperCase()}`);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      onCancel={event => { event.preventDefault(); onClose(); }}
      className="fixed inset-0 m-0 h-full w-full max-h-none max-w-none items-center justify-center overflow-auto p-4 bg-black/80 backdrop-blur-sm open:flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-base font-semibold text-zinc-100">
                {user || profile ? 'Hồ Sơ Học Viên' : 'Xác Thực Tài Khoản'}
              </h2>
              <p className="text-xs text-zinc-400 font-mono">
                {isConfigured ? 'Đồng bộ đám mây' : 'Lưu trữ cục bộ trên thiết bị'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User is already logged in */}
        {user || profile ? (
          <div className="p-6 space-y-5">
            <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 flex items-center justify-center text-zinc-950 font-bold text-lg">
                  {(profile?.display_name || user?.email || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-zinc-100">{profile?.display_name || 'Học viên'}</h3>
                  <p className="text-xs text-zinc-400 font-mono">{user?.email || profile?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Vai trò:{' '}
                    {role === 'evaluator'
                      ? 'Giám khảo'
                      : role === 'admin'
                      ? 'Quản trị viên'
                      : 'Học viên'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/60 text-xs text-zinc-400 space-y-1">
                <div>Chuyên môn: <span className="text-zinc-200">{profile?.career_track}</span></div>
                <div>
                  Phím bổ trợ:{' '}
                  <span className="text-zinc-200 uppercase">
                    {profile?.shortcut_modifier === 'mac' ? 'macOS' : 'Windows'}
                  </span>
                </div>
              </div>
            </div>

            {showDemoSwitcher && (
              <div className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/60 text-xs space-y-2">
                <div className="flex items-center justify-between text-zinc-400 font-mono">
                  <span>Chế độ thử nghiệm phát triển:</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleMockRoleSwitch('student')}
                    className={`py-1.5 px-2 rounded text-center text-xs border transition-colors ${
                      role === 'student' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Học viên
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockRoleSwitch('evaluator')}
                    className={`py-1.5 px-2 rounded text-center text-xs border transition-colors ${
                      role === 'evaluator' ? 'bg-blue-500/20 border-blue-500/50 text-blue-300' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Giám khảo
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockRoleSwitch('admin')}
                    className={`py-1.5 px-2 rounded text-center text-xs border transition-colors ${
                      role === 'admin' ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Quản trị
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={async () => {
                try { await signOut(); onClose(); }
                catch { setErrorMsg('Không thể đăng xuất. Hãy thử lại.'); }
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          /* User is NOT logged in: Tabs */
          <div className="p-6 space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => { setActiveTab('signin'); setErrorMsg(null); }}
                className={`py-1.5 rounded text-center transition-colors ${
                  activeTab === 'signin' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('signup'); setErrorMsg(null); }}
                className={`py-1.5 rounded text-center transition-colors ${
                  activeTab === 'signup' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Đăng ký
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('forgot'); setErrorMsg(null); }}
                className={`py-1.5 rounded text-center transition-colors ${
                  activeTab === 'forgot' ? 'bg-zinc-800 text-zinc-100 shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Khôi phục
              </button>
            </div>

            {/* Notification messages */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB: SIGN IN */}
            {activeTab === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email Học Viên</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tenhocvien@domain.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Mật Khẩu</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang xác thực...
                    </>
                  ) : (
                    'Đăng Nhập'
                  )}
                </button>
              </form>
            )}

            {/* TAB: SIGN UP */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Họ & Tên Hiển Thị</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tenhocvien@domain.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Mật Khẩu (Ít nhất 6 ký tự)</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Lộ Trình Ưu Tiên</label>
                  <select
                    value={careerTrack}
                    onChange={e => setCareerTrack(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="Thiết kế Vector & Nhận diện thương hiệu">
                      Thiết kế Vector &amp; Nhận diện thương hiệu
                    </option>
                    <option value="Chỉnh sửa ảnh & Ghép cảnh chuyên nghiệp">
                      Chỉnh sửa ảnh &amp; Ghép cảnh chuyên nghiệp
                    </option>
                    <option value="Biên tập dàn trang & Xuất bản ấn phẩm">
                      Biên tập dàn trang &amp; Xuất bản ấn phẩm
                    </option>
                    <option value="Tự động hóa thiết kế & Lập trình MCP">
                      Tự động hóa thiết kế &amp; Lập trình MCP
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang khởi tạo tài khoản...
                    </>
                  ) : (
                    'Tạo Tài Khoản Học Viên'
                  )}
                </button>
              </form>
            )}

            {/* TAB: FORGOT PASSWORD */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-3.5">
                <p className="text-xs text-zinc-400">
                  Nhập địa chỉ email đăng ký để nhận liên kết xác thực đặt lại mật khẩu an toàn.
                </p>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="tenhocvien@domain.com"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    'Gửi Liên Kết Khôi Phục'
                  )}
                </button>
              </form>
            )}

            {showDemoSwitcher && (
              <div className="pt-2 border-t border-zinc-800/80 text-center">
                <button
                  type="button"
                  onClick={() => handleMockRoleSwitch('student')}
                  className="text-xs text-amber-400/80 hover:text-amber-300 font-mono transition-colors"
                >
                  Trải nghiệm nhanh với tư cách Học viên thử nghiệm &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </dialog>,
    document.body
  );
};
