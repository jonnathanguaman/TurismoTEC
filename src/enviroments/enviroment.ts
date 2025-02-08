// environment.ts
import Swal from 'sweetalert2';

export const environment = {
  production: false,
  urlHost: 'http://localhost:8080/public/v1',
  urlAut: 'http://localhost:8080',
  urlMap: 'http://localhost:4200/lugar/',
  
  // urlHost: 'http://24.144.105.202:8080/public/v1',
  // urlAut: 'http://24.144.105.202:8080',
  // urlMap: 'http://24.144.105.202:80/lugar/',
  mensajeToast: (tipo: 'success' | 'error' | 'warning' | 'info' | 'question', mensajeCuerpo: string, footer: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      showCloseButton: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: tipo,
      title: mensajeCuerpo,
      footer: footer
    });
  },

  mensajeEmergente(titulo:string,texto:string,tipo: 'success' | 'error' | 'warning' | 'info' | 'question'){
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      return result.isConfirmed;
    });
  },

  mensajeConfirmacion(titulo: string, texto: string, tipo: 'success' | 'error' | 'warning' | 'info' | 'question') {
    return Swal.fire({
      title: titulo,
      text: texto,
      icon: tipo,
      showCancelButton: true,
      confirmButtonColor: '#3085d6', 
      cancelButtonColor: '#d33',    
      confirmButtonText: 'Sí',      
      cancelButtonText: 'No'        
    }).then((result) => {
      return result.isConfirmed; 
    });
  }
  
};
