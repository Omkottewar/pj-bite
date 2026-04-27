import Swal from 'sweetalert2';

/**
 * Premium SweetAlert2 Configuration for PJ Bite
 * Brand Colors:
 * - Forest Green: #1E5C2A
 * - Light Green: #F0F4F0
 * - Amber: #D97706
 */

const commonOptions = {
  width: '24rem',
  padding: '1.5rem',
  customClass: {
    popup: 'rounded-[2rem] border border-[#E8E6E1] premium-shadow font-sans',
    title: 'text-xl font-black text-brand-text font-serif leading-tight',
    confirmButton: 'bg-brand-primary hover:bg-[#164a20] text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-md shadow-brand-primary/20 uppercase tracking-widest text-[10px] outline-none',
    cancelButton: 'bg-brand-bg hover:bg-[#F0EDE8] text-brand-text-muted font-black px-6 py-2.5 rounded-xl transition-all border border-[#E8E6E1] uppercase tracking-widest text-[10px] outline-none',
  },
  buttonsStyling: false,
  showClass: {
    popup: 'animate__animated animate__fadeInUp animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOutDown animate__faster'
  }
};

export const showSuccess = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: 'success',
    iconColor: '#1E5C2A',
    title,
    text,
  });
};

export const showError = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: 'error',
    iconColor: '#DC2626',
    title,
    text,
  });
};

export const showWarning = (title: string, text?: string) => {
  return Swal.fire({
    ...commonOptions,
    icon: 'warning',
    iconColor: '#D97706',
    title,
    text,
  });
};

export const showConfirm = async (title: string, text?: string, confirmText = 'Yes, Proceed') => {
  const result = await Swal.fire({
    ...commonOptions,
    title,
    text,
    icon: 'question',
    iconColor: '#1E5C2A',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  });
  return result.isConfirmed;
};

/**
 * Toast Style SweetAlert (Non-blocking)
 */
export const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      popup: 'rounded-2xl border border-[#E8E6E1] premium-shadow-sm font-sans',
    }
  });

  return Toast.fire({
    icon,
    title,
    iconColor: icon === 'success' ? '#1E5C2A' : (icon === 'error' ? '#DC2626' : '#D97706'),
  });
};

export default Swal;
