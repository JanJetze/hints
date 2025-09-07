# Daily Word Puzzle Game Specification

## Game Overview
A daily word guessing game where players receive one visual hint per day to guess multiple words. The words are arranged so that when solved, a specific column spells out a meaningful sentence or phrase.

## Game Mechanics
- **One hint per day** is released for each word
- **Visual hints**: Each hint is an image that symbolizes or represents the target word
- **Progressive revelation**: Hints accumulate over time, giving players more clues as days pass
- **Cross-word alignment**: Words are positioned so a specific column forms a sentence when read vertically

## Layout Structure

### Left Side: Word Overview Panel
**Purpose**: Shows the game state and word structure

**Components**:
- **Word Grid Display**:
  - Each word shown as a series of empty boxes (one box per letter)
  - Words are vertically aligned in rows
  - One specific column is **highlighted** (different background color/border)
  - The highlighted column will spell out the target sentence when solved
- **Word Lengths**: Clearly visible number of letters for each word
- **Progress Indicators**: Visual indication of which words have been guessed/solved

### Right Side: Hint Viewing Panel
**Purpose**: Interactive hint exploration system

#### Main Hint Display Area
- **Large hint image**: Current selected hint displayed prominently
- **Day indicator**: Shows which day this hint was released (e.g., "Day 3")
- **Word association**: Clear indication of which word this hint relates to

#### Navigation Controls (Below hint image)
Three buttons arranged horizontally:

1. **Left Arrow Button** (`←`)
   - Function: Navigate to previous hint
   - Behavior: Only visible if there are previous hints available
   - Hidden when viewing the first available hint

2. **Grid/Tiles Button** (`⊞` or grid icon)
   - Function: Toggle to thumbnail grid view
   - Shows all available hints as small thumbnails in a grid layout
   - Clicking any thumbnail switches main display to that hint

3. **Right Arrow Button** (`→`)
   - Function: Navigate to next hint
   - Behavior: Only visible if there are subsequent hints available
   - Hidden when viewing the most recent hint

#### Grid View Mode
- **Thumbnail layout**: All available hints displayed as small images in a grid
- **Day labels**: Each thumbnail shows its release day
- **Interactive**: Clicking any thumbnail returns to single-hint view showing that hint
- **Visual hierarchy**: Current/selected hint highlighted or indicated

## Technical Requirements

### State Management
- Track current day/hint being viewed
- Manage which hints have been "unlocked" based on game progression
- Store solved words and player progress
- Handle view mode switching (single hint vs. grid view)

### Responsive Design
- Left panel should be roughly 40-50% of screen width
- Right panel takes remaining space
- Mobile-friendly adaptation (stack panels vertically on small screens)

### User Interface Elements
- **Clear visual hierarchy** between solved and unsolved words
- **Intuitive navigation** between hints
- **Accessible button states** (disabled/hidden when not applicable)
- **Loading states** for hint images
- **Error handling** for failed image loads

### Data Structure Example
```
Game Data:
- words: ["EXAMPLE", "ANOTHER", "WORDHERE"]
- highlighted_column: 2 (0-indexed)
- hints: [
    {word_index: 0, day: 1, image_url: "hint1.jpg", alt_text: "Description"},
    {word_index: 1, day: 1, image_url: "hint2.jpg", alt_text: "Description"},
    // ... more hints
  ]
- current_day: number (determines which hints are available)
```

## User Experience Flow
1. **Day 1**: Player gets first hint image (for Row 1 word) and can start guessing
2. **Day 2**: Player gets second hint image (for Row 2 word) 
3. **Day 3**: Player gets third hint image (for Row 3 word)
4. **And so on...** until all rows have their hint images revealed
5. **Word input**: Players can fill in letters for any row at any time (even before getting its hint)
6. **Hint viewing**: Players use right panel to view available hints in large format
7. **Victory condition**: All words solved correctly, revealing the target sentence in highlighted column

## Additional Interface Requirements

### Word Input Functionality
- **Clickable letter boxes**: Each letter position should be individually selectable
- **Keyboard input**: Players can type letters directly when a box is selected
- **Navigation**: Tab/arrow keys to move between letter positions
- **Validation feedback**: Visual indication of correct/incorrect letters (optional)
- **Auto-advance**: Cursor moves to next box when typing (optional)

### Left Panel Layout Details
```
Row 1: [_][_][_][_][_][_][_] 📷 (thumbnail of hint image)
Row 2: [_][_][_][_][_][_][_] 🔒 (locked - hint not yet available)  
Row 3: [W][O][R][D][H][E][R][E] ✓ 📷 (completed word)
       ↑
   Highlighted column
```

## Visual Design Notes
- **Clean, minimalist interface** focusing attention on hints and word grid
- **Consistent spacing** and typography
- **Color coding** for different states (solved, unsolved, highlighted column)
- **Smooth transitions** between different hints and view modes
- **Professional appearance** suitable for daily puzzle game audience