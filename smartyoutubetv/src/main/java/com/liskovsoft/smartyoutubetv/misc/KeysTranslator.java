package com.liskovsoft.smartyoutubetv.misc;

import android.view.KeyEvent;

public class KeysTranslator {
    private static final KeyEvent EMPTY_EVENT = new KeyEvent(0, 0);
    private boolean mDownFired;
    private boolean mDisable = true;

    /**
     * Ignore non-paired key up events
     *
     * @param event event
     * @return is ignored
     */
    private boolean isEventIgnored(KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            mDownFired = true;
            return false;
        }

        if (event.getAction() == KeyEvent.ACTION_UP && mDownFired) {
            mDownFired = false;
            return false;
        }

        return true;
    }

    public KeyEvent doTranslateKeys(KeyEvent event) {
        if (mDisable) {
            event = translateEscapeToBack(event); // exit from loading by pressing escape or back keys
            return event;
        }

        if (isEventIgnored(event)) {
            return EMPTY_EVENT;
        }

        event = translateBackToEscape(event);
        event = translateMenuToGuide(event);
        event = translateNumpadEnterToEnter(event);
        event = translateButtonAToEnter(event);
        return event;
    }

    private KeyEvent createNewEvent(KeyEvent event, int keyCode) {
        return new KeyEvent(event.getDownTime(), event.getEventTime(), event.getAction(), keyCode, event.getRepeatCount(), event.getMetaState(),
                event.getDeviceId(), event.getScanCode(), event.getFlags(), event.getSource());
    }

    private KeyEvent translateButtonAToEnter(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BUTTON_A) {
            // pay attention, you must pass action_up instead of action_down
            event = new KeyEvent(event.getAction(), KeyEvent.KEYCODE_ENTER);
        }
        return event;
    }

    private KeyEvent translateNumpadEnterToEnter(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_NUMPAD_ENTER) {
            // pay attention, you must pass action_up instead of action_down
            event = new KeyEvent(event.getAction(), KeyEvent.KEYCODE_ENTER);
        }
        return event;
    }

    private KeyEvent translateBackToEscape(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {
            // pay attention, you must pass action_up instead of action_down
            event = new KeyEvent(event.getAction(), KeyEvent.KEYCODE_ESCAPE);
        }
        return event;
    }

    private KeyEvent translateEscapeToBack(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_ESCAPE) {
            // pay attention, you must pass action_up instead of action_down
            event = new KeyEvent(event.getAction(), KeyEvent.KEYCODE_BACK);
        }
        return event;
    }

    private KeyEvent translateMenuToGuide(KeyEvent event) {
        if (event.getKeyCode() == KeyEvent.KEYCODE_MENU) {
            // pay attention, you must pass action_up instead of action_down
            event = new KeyEvent(event.getAction(), KeyEvent.KEYCODE_G);
        }
        return event;
    }

    public void disable() {
        mDisable = true;
    }

    public void enable() {
        mDisable = false;
    }
}
