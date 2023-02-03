import { useEffect, useState } from "react"


export const useUnlockPaywall = (ready, src = 'http://localhost:3001/static/unlock.latest.min.js') => {
  const [status, setStatus] = useState(src ? "loading" : "idle");

  useEffect(
    () => {
      if (!ready) {
        setStatus("idle");
        return;
      }

      window.unlockProtocolConfig = {
        locks: {
          "0x6d19c741438e1c913d32e46c0bf817f4f2fd4f6e": {
            network: 5
          }
        },
        autoconnect: true,
        skipRecipient: true
      }
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus("idle");
        return;
      }
      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script = document.querySelector(`script[src="${src}"]`);
      if (!script) {
        // Create script
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.setAttribute("data-status", "loading");
        // Add script to document body
        document.body.appendChild(script);
        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event) => {
          script.setAttribute(
            "data-status",
            event.type === "load" ? "ready" : "error"
          );
        };
        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute("data-status"));
      }
      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event) => {
        setStatus(event.type === "load" ? "ready" : "error");
      };
      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);

      // handle event!
      window.addEventListener('unlockProtocol.status', function (e) {
        // Update the status!
      })


      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
    [src, ready] // Only re-run effect if script src changes
  );

  const purchase = () => {
    if (window.unlockProtocol) {
      window.unlockProtocol.loadCheckoutModal()
    }
  }

  return { status, purchase }


}