import { useEffect, useState } from 'react';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const collegeHabits = [
  { id: 1, name: 'Read Bible and Journal' }, 
  { id: 2, name: 'Finish Homework (Before Weekend)' },
  { id: 3, name: 'Workout Every Morning' },
  { id: 4, name: 'Study for 2 Hours' },
  { id: 5, name: 'Drink 1st 40oz Cup (12-1 PM)' },
  { id: 6, name: 'Drink 2nd 40oz Cup (By 8 PM)' },
  { id: 7, name: 'Sleep by 9:30 PM' },
];

const dailyNotes = {
  Monday: "Start your week strong! You got this 💪\n\nRemember to drink your water between 12-1 PM and by 8 PM. Also, set aside time to study for 2 hours today!",
  Tuesday: "Keep up the great work! Stay focused 👊\n\nDon't forget your water breaks at noon and evening, and study hard for 2 hours!",
  Wednesday: "Halfway there! Keep pushing 💯\n\nStay hydrated and remember to study for your 2 hours today.",
  Thursday: "Almost Friday! Finish strong 🎉\n\nMake sure to drink water on time and complete your 2-hour study session.",
  Friday: "You made it! Prepare for a good weekend 🌟\n\nDrink up and focus on your study goals before the weekend starts.",
  Saturday: "Take some rest and recharge 🔋\n\nEven on rest days, keep drinking your water and fit in some study if you can!",
  Sunday: "Plan your next week and set new goals 📅\n\nStay hydrated and review your studies to be ready for the week ahead.",
};


function App() {
  const [currentDayIndex, setCurrentDayIndex] = useState(() => {
    const todayNum = new Date().getDay(); // Sun=0 ... Sat=6
    return todayNum === 0 ? 6 : todayNum - 1;
  });

  const [habitsDone, setHabitsDone] = useState(() => {
    const saved = localStorage.getItem('habitsDone');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('habitsDone', JSON.stringify(habitsDone));
  }, [habitsDone]);

  useEffect(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilSunday = (7 - dayOfWeek) % 7;
    const nextReset = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + daysUntilSunday,
      23,
      59,
      0,
      0
    );
    const msUntilReset = nextReset.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setHabitsDone({});
      setInterval(() => setHabitsDone({}), 7 * 24 * 60 * 60 * 1000);
    }, msUntilReset);

    return () => clearTimeout(timeout);
  }, []);

  const toggleDone = (habitId) => {
    const day = days[currentDayIndex];
    setHabitsDone((prev) => {
      const dayHabits = prev[day] || {};
      return {
        ...prev,
        [day]: {
          ...dayHabits,
          [habitId]: !dayHabits[habitId],
        },
      };
    });
  };

  const prevDay = () => {
    setCurrentDayIndex((i) => (i === 0 ? days.length - 1 : i - 1));
  };

  const nextDay = () => {
    setCurrentDayIndex((i) => (i === days.length - 1 ? 0 : i + 1));
  };

  const currentDay = days[currentDayIndex];
  const dayHabits = habitsDone[currentDay] || {};
  const isHomeworkDisabled = currentDay === 'Saturday' || currentDay === 'Sunday';

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        gap: 40,
      }}
    >
      {/* Left: Habit Tracker */}
      <div
        style={{
          flex: 1,
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: 20,
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <h1 style={{ textAlign: 'center' }}>Daily Habit Tracker</h1>
        <div
          style={{
            marginBottom: 20,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
          }}
        >
          {currentDay}
        </div>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {collegeHabits.map(({ id, name }) => (
            <li
              key={id}
              style={{
                marginBottom: 16,
                fontSize: 18,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <input
                type="checkbox"
                checked={!!dayHabits[id]}
                onChange={() => toggleDone(id)}
                disabled={id === 1 && isHomeworkDisabled}
                style={{ width: 24, height: 24, marginRight: 12, cursor: 'pointer' }}
              />
              <label
                htmlFor={`habit-${id}`}
                style={{
                  color: id === 1 && isHomeworkDisabled ? '#999' : '#000',
                  cursor: id === 1 && isHomeworkDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {name}
                {id === 1 && isHomeworkDisabled && ' (Due by Friday)'}
              </label>
            </li>
          ))}
        </ul>

        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <button
            onClick={prevDay}
            style={{
              padding: '8px 16px',
              marginRight: 20,
              cursor: 'pointer',
              borderRadius: 5,
              border: '1px solid #888',
              backgroundColor: '#f0f0f0',
              fontSize: 16,
            }}
          >
            ← Previous Day
          </button>
          <button
            onClick={nextDay}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 5,
              border: '1px solid #888',
              backgroundColor: '#f0f0f0',
              fontSize: 16,
            }}
          >
            Next Day →
          </button>
        </div>
      </div>

      {/* Right: Notepad with lines */}
      <div
        style={{
          flexBasis: 320,
          border: '1px solid #a5c9ff',
          borderRadius: 8,
          backgroundColor: '#f7fbff',
          padding: 20,
          fontSize: 16,
          color: '#0a4f9c',
          fontFamily: "'Courier New', Courier, monospace",
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.05)',
          position: 'relative',
          lineHeight: 1.6,
          userSelect: 'none',
          // lined paper effect with repeating linear gradient
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 22px,
              #a5c9ff 23px
            )
          `,
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: 10, borderBottom: '2px solid #a5c9ff', paddingBottom: 6 }}>
          Note for {currentDay}
        </h3>
        <p>{dailyNotes[currentDay]}</p>
      </div>
    </div>
  );
}

export default App;



