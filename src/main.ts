import { provideZonelessChangeDetection } from "@angular/core";
import { createCustomElement } from "@angular/elements";
import { createApplication } from "@angular/platform-browser";
import { ChatComponent } from "@/ui/chat.component";

const TAG = "alejo-chat";

async function register(): Promise<void> {
  if (customElements.get(TAG)) return;

  const application = await createApplication({
    providers: [provideZonelessChangeDetection()],
  });

  customElements.define(
    TAG,
    createCustomElement(ChatComponent, { injector: application.injector }),
  );
}

void register();
