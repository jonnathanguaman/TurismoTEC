import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isChatOpen = false;
  userInput = '';
  messages: { text: string; user: boolean }[] = [];

  toggleChatbot() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage() {
    if (this.userInput.trim()) {
      this.messages.push({ text: this.userInput, user: true });
      this.userInput = '';

      // Simulación de respuesta del bot (puedes personalizar esto)
      setTimeout(() => {
        this.messages.push({ text: 'Gracias por tu mensaje, ¿cómo puedo ayudarte?', user: false });
      }, 1000);
    }
  }
}
