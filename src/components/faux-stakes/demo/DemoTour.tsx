"use client";

import { useCallback } from "react";
import {
  Joyride,
  EVENTS,
  STATUS,
  type EventData,
  type Step,
} from "react-joyride";

const TOUR_STEPS: Step[] = [
  {
    target: '[data-tour="markets"]',
    title: "Welcome to Sports Day",
    content:
      "This is a friendly prediction competition. Three teams compete across three fictional Sports Day events. Your challenge is to predict which team will win each event.",
    placement: "bottom",
    skipBeacon: true,
  },
  {
    target: '[data-tour="prediction-controls"]',
    title: "Make your prediction",
    content:
      "Choose Red, Blue or Green Team and decide how many virtual Orakls to commit. The reward multiplier shows how many Orakls you'll receive if your prediction is correct. You can adjust your commitment while predictions remain open.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="bet-slip"]',
    title: "Your predictions",
    content:
      "Your confirmed predictions appear here. You can review your selected team, committed Orakls and potential reward. Once an event finishes, you'll see whether you predicted correctly.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="wallet"]',
    title: "Your Orakls",
    content:
      "Everyone uses fictional Orakls rather than real money. You start with 1,000 Orakls. Committing Orakls reduces your available balance, but your competition score still includes commitments on unfinished events.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="market-lifecycle"]',
    title: "Reveal Sports Day results",
    content:
      "Each event starts with predictions open. Close predictions when you're ready, then reveal the simulated result. Everyone's predictions are evaluated together, and the leaderboard updates automatically.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="leaderboard"]',
    title: "Compete with your friends",
    content:
      "Alex, Sam and Jordan have made their own predictions. The leaderboard shows competition scores, correct prediction counts and each player's most recent result. Predicting correctly counts towards accuracy regardless of the Orakls committed.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="performance"]',
    title: "Track your performance",
    content:
      "See your prediction accuracy, correct predictions, current streak, best streak and overall Orakl change. Net Orakl change only counts completed events, so unfinished predictions aren't treated as losses.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="achievements"]',
    title: "Unlock achievements",
    content:
      "Correct predictions, consecutive successes and competition comebacks can unlock achievements. These are part of the wider Orakl achievement concept. Collectible digital cards are planned separately and aren't included in this demo.",
    placement: "auto",
    skipBeacon: true,
  },
  {
    target: '[data-tour="wallet-activity"]',
    title: "Review your activity",
    content:
      "This history records committed Orakls, adjustments, returns and rewards. It helps you understand how your virtual balance changed during Sports Day.",
    placement: "auto",
    skipBeacon: true,
  },
];

type DemoTourProps = {
  run: boolean;
  onClose: () => void;
};

export function DemoTour({ run, onClose }: DemoTourProps) {
  const handleEvent = useCallback(
    (data: EventData) => {
      if (
        data.type === EVENTS.TOUR_END ||
        data.status === STATUS.FINISHED ||
        data.status === STATUS.SKIPPED
      ) {
        onClose();
      }
    },
    [onClose],
  );

  return (
    <Joyride
      run={run}
      steps={TOUR_STEPS}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        skipBeacon: true,
        showProgress: true,
        buttons: ["back", "close", "skip", "primary"],
        scrollOffset: 110,
        overlayClickAction: false,
        blockTargetInteraction: true,
        primaryColor: "#F05A28",
        backgroundColor: "#18181b",
        textColor: "#f4f4f5",
        arrowColor: "#18181b",
        overlayColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 10000,
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish tour",
        next: "Next",
        skip: "Skip tour",
      }}
      styles={{
        tooltip: {
          borderRadius: 18,
          padding: 20,
          maxWidth: 380,
        },
        tooltipTitle: {
          fontSize: 18,
          fontWeight: 700,
          textAlign: "left",
        },
        tooltipContent: {
          fontSize: 14,
          lineHeight: 1.65,
          textAlign: "left",
        },
        buttonPrimary: {
          borderRadius: 999,
          padding: "10px 18px",
          color: "#09090b",
          fontWeight: 700,
        },
        buttonBack: {
          color: "#d4d4d8",
          marginRight: 12,
        },
        buttonSkip: {
          color: "#a1a1aa",
        },
      }}
    />
  );
}
