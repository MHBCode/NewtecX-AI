import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LogService {
  private container?: HTMLElement;

  registerContainer(container: HTMLElement) {
    this.container = container;
  }

  push(message: string) {
    if (this.container) {
      const div = document.createElement('div');
      div.className = 'logItem'; 
      div.textContent = message;
      this.container.appendChild(div);
    }
  }
    pushValidationNote(status: boolean, note: string) {
      if (note !== null){
          if (this.container) {
          const div = document.createElement('div');
          div.style.display = 'flex';
          div.style.alignItems = 'center';
          div.style.gap = '8px';
          div.className = 'logItem';

          // Circle
          const circle = document.createElement('span');
          circle.style.width = '12px';
          circle.style.height = '12px';
          circle.style.borderRadius = '50%';
          circle.style.display = 'inline-block';
          circle.style.backgroundColor = status ? 'green' : 'red';

          // Note text
          const text = document.createElement('span');
          text.textContent = note;

          div.appendChild(circle);
          div.appendChild(text);

          this.container.appendChild(div);
        }
      }
  }
}