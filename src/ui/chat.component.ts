import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
  signal,
} from "@angular/core";
import { ask } from "@/application/use-cases/ask";
import type { Message } from "@/domain/chat/message";
import { MAX_QUESTION_LENGTH } from "@/domain/chat/message";
import { answerProvider } from "@/infrastructure/container";

const OPENING = [
  "¿Qué experiencia tiene en Terraform?",
  "¿Ha trabajado con microfrontends?",
  "¿Cómo está hecho este sitio?",
];

@Component({
  selector: "alejo-chat",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.ShadowDom,
  template: `
    <section class="panel" part="panel">
      <header class="head">
        <span class="dot" aria-hidden="true"></span>
        <div>
          <h2>{{ heading() }}</h2>
          <p>{{ intro() }}</p>
        </div>
      </header>

      <ol class="log" aria-live="polite" aria-label="Conversación">
        @for (message of messages(); track message.id) {
          <li class="turn" [class.visitor]="message.author === 'visitor'">
            <p>{{ message.body }}</p>
            @if (message.source === "fallback") {
              <span class="tag">sin dato en el perfil</span>
            }
          </li>
        }
        @if (thinking()) {
          <li class="turn thinking"><p>Buscando en el perfil…</p></li>
        }
      </ol>

      <ul class="hints">
        @for (hint of hints(); track hint) {
          <li>
            <button type="button" (click)="send(hint)" [disabled]="thinking()">
              {{ hint }}
            </button>
          </li>
        }
      </ul>

      <form class="ask" (submit)="submit($event)">
        <label class="sr-only" for="q">Tu pregunta</label>
        <input
          id="q"
          name="q"
          type="text"
          autocomplete="off"
          [attr.maxlength]="maxLength"
          [value]="draft()"
          (input)="draft.set($any($event.target).value)"
          placeholder="Pregunta por una tecnología, el dominio o este sitio"
        />
        <button type="submit" [disabled]="thinking() || !draft().trim()">Preguntar</button>
      </form>

      <p class="note">Solo tiene acceso al perfil profesional público.</p>
    </section>
  `,
  styles: `
    :host {
      --chat-bg: #0a1020;
      --chat-surface: rgba(255, 255, 255, 0.04);
      --chat-border: rgba(110, 170, 235, 0.16);
      --chat-text: #e9f0fa;
      --chat-muted: #7f90aa;
      --chat-accent: #22d3ee;

      display: block;
      font-family: ui-sans-serif, system-ui, sans-serif;
      color: var(--chat-text);
      container-type: inline-size;
    }

    .panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1.25rem;
      border: 1px solid var(--chat-border);
      border-radius: 1rem;
      background: var(--chat-bg);
    }

    .head {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .dot {
      flex: none;
      width: 0.5rem;
      height: 0.5rem;
      margin-top: 0.4rem;
      border-radius: 50%;
      background: var(--chat-accent);
      box-shadow: 0 0 10px var(--chat-accent);
    }

    h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .head p,
    .note {
      margin: 0.25rem 0 0;
      font-size: 0.75rem;
      color: var(--chat-muted);
    }

    .log {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      max-height: 18rem;
      margin: 0;
      padding: 0;
      overflow-y: auto;
      list-style: none;
    }

    .turn {
      max-width: 85%;
      padding: 0.6rem 0.8rem;
      border: 1px solid var(--chat-border);
      border-radius: 0.75rem;
      background: var(--chat-surface);
      font-size: 0.875rem;
      line-height: 1.55;
    }

    .turn p {
      margin: 0;
    }

    .turn.visitor {
      align-self: flex-end;
      border-color: var(--chat-accent);
      background: rgba(34, 211, 238, 0.12);
    }

    .turn.thinking {
      color: var(--chat-muted);
    }

    .tag {
      display: inline-block;
      margin-top: 0.4rem;
      font-family: ui-monospace, monospace;
      font-size: 0.625rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--chat-muted);
    }

    .hints {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .hints button {
      padding: 0.3rem 0.6rem;
      border: 1px solid var(--chat-border);
      border-radius: 999px;
      background: transparent;
      color: var(--chat-muted);
      font: inherit;
      font-size: 0.75rem;
      cursor: pointer;
    }

    .hints button:hover:not(:disabled) {
      border-color: var(--chat-accent);
      color: var(--chat-accent);
    }

    .ask {
      display: flex;
      gap: 0.5rem;
    }

    .ask input {
      flex: 1;
      min-width: 0;
      padding: 0.6rem 0.75rem;
      border: 1px solid var(--chat-border);
      border-radius: 0.6rem;
      background: var(--chat-surface);
      color: inherit;
      font: inherit;
      font-size: 0.875rem;
    }

    .ask button {
      padding: 0.6rem 1rem;
      border: 0;
      border-radius: 0.6rem;
      background: var(--chat-accent);
      color: #04060c;
      font: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.5;
      cursor: default;
    }

    :focus-visible {
      outline: 2px solid var(--chat-accent);
      outline-offset: 2px;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip-path: inset(50%);
    }

    @container (max-width: 22rem) {
      .ask {
        flex-direction: column;
      }
    }
  `,
})
export class ChatComponent {
  readonly heading = input("Pregúntale a mi CV");
  readonly intro = input("Responde solo con información pública del perfil.");

  readonly maxLength = MAX_QUESTION_LENGTH;
  readonly messages = signal<Message[]>([]);
  readonly hints = signal<string[]>(OPENING);
  readonly thinking = signal(false);
  readonly draft = signal("");

  private turn = 0;

  submit(event: Event): void {
    event.preventDefault();
    void this.send(this.draft());
  }

  async send(question: string): Promise<void> {
    if (this.thinking()) return;

    const text = question.trim();
    if (!text) return;

    this.draft.set("");
    this.push({ author: "visitor", body: text });
    this.thinking.set(true);

    const result = await ask(answerProvider, text);

    this.thinking.set(false);
    this.push({ author: "assistant", body: result.body, source: result.source });
    if (result.related.length) this.hints.set(result.related);
  }

  private push(message: Omit<Message, "id">): void {
    this.turn += 1;
    this.messages.update((log) => [...log, { ...message, id: `t${this.turn}` }]);
  }
}
