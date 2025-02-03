import { Component } from '@angular/core';
import { ChatBotService } from '../Services/chatbot/chat-bot.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  
  isChatOpen = false;
  userInput = '';
  messages: { text: string; user: boolean }[] = [];

  constructor(private chatBotService:ChatBotService) {}

  toggleChatbot() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      // Añadir el mensaje del usuario
      this.messages.push({ text: this.userInput, user: true });
      const userQuery = this.userInput;  // Almacenar la consulta del usuario
      this.userInput = '';  // Limpiar la entrada del usuario

      // Llamar al servicio de OpenAI para enviar la consulta al backend
      this.chatBotService.queryDatabase(userQuery).subscribe(
        (data:any) => {
          // Si se encontraron resultados, mostrar los resultados
          if (data.success && data.data) {
            this.messages.push({ text: data.data, user: false });
          } else {
            // Si no se encontraron resultados, indicar al usuario
            this.messages.push({ text: 'No se encontraron resultados para tu consulta.', user: false });
          }
        },
        (error:any) => {
          // Manejo de errores
          this.messages.push({ text: 'Ocurrió un error al procesar tu solicitud.', user: false });
        }
      );
    }
  }

}
