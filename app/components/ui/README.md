# UI Components Module

The UI Components module provides a comprehensive set of reusable UI components for the Bolt application, following modern React patterns and accessibility best practices.

## Directory Structure

```
ui/
├── BackgroundRays/
│   ├── index.tsx
│   └── styles.module.scss
├── Badge.tsx
├── Button.tsx
├── Card.tsx
├── Collapsible.tsx
├── Dialog.tsx
├── Dropdown.tsx
├── IconButton.tsx
├── Input.tsx
├── Label.tsx
├── LoadingDots.tsx
├── LoadingOverlay.tsx
├── PanelHeader.tsx
├── PanelHeaderButton.tsx
├── Popover.tsx
├── Progress.tsx
├── ScrollArea.tsx
├── Separator.tsx
├── SettingsButton.tsx
├── Slider.tsx
├── Switch.tsx
├── Tabs.tsx
├── ThemeSwitch.tsx
└── use-toast.ts
```

## Component Documentation

### Button (`Button.tsx`)

A versatile button component with support for multiple variants and sizes.

#### Exports

```typescript
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  _asChild?: boolean;
  className?: string;
}

export const Button: React.ForwardRefExoticComponent<ButtonProps>;
export const buttonVariants: (props: ButtonProps) => string;
```

#### Variants

- `default`: Standard button with background
- `destructive`: Red background for dangerous actions
- `outline`: Transparent with border
- `secondary`: Slightly different background
- `ghost`: No background until hover
- `link`: Appears as a link with underline on hover

#### Sizes

- `default`: Standard size (h-9 px-4 py-2)
- `sm`: Small size (h-8 px-3)
- `lg`: Large size (h-10 px-8)
- `icon`: Square icon button (h-9 w-9)

#### Features

- Full keyboard accessibility
- Focus ring styling
- Disabled state handling
- Hover and active states
- Flexible content support
- Theme-aware styling

#### Usage

```tsx
import { Button } from '~/components/ui/Button';

// Basic usage
<Button>Click me</Button>

// Variant usage
<Button variant="destructive">Delete</Button>

// Size usage
<Button size="sm">Small Button</Button>

// Combined usage
<Button variant="outline" size="lg">
  Large Outline Button
</Button>

// With icon
<Button variant="ghost" size="icon">
  <IconComponent />
</Button>
```

#### Styling

The button uses CSS variables for theming:

- `--bolt-elements-background`: Button background
- `--bolt-elements-textPrimary`: Text color
- `--bolt-elements-background-depth-2`: Hover background
- `--bolt-elements-borderColor`: Focus ring color

#### Accessibility

- Proper focus management
- ARIA attributes
- Keyboard navigation
- Screen reader support
- Disabled state handling

### Input (`Input.tsx`)

A flexible input component that supports all standard HTML input types with enhanced styling and accessibility.

#### Exports

```typescript
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Extends all standard HTML input attributes
}

export const Input: React.ForwardRefExoticComponent<InputProps>;
```

#### Features

- Full HTML input type support
- Consistent styling across types
- Focus state management
- File input styling
- Placeholder styling
- Disabled state handling
- Error state support
- Theme-aware styling

#### Styling

The input uses CSS variables for theming:

- `--bolt-elements-border`: Border color
- `--bolt-elements-background`: Input background
- `--bolt-elements-textSecondary`: Placeholder text color
- `--bolt-elements-ring`: Focus ring color

#### States

- **Default**: Clean border with background
- **Focus**: Ring effect with offset
- **Disabled**: Reduced opacity with not-allowed cursor
- **File Input**: Custom file input styling
- **Error**: (via className) Red border and text
- **Success**: (via className) Green border and text

#### Usage

```tsx
import { Input } from '~/components/ui/Input';

// Basic text input
<Input type="text" placeholder="Enter your name" />

// Password input
<Input type="password" placeholder="Enter password" />

// Number input
<Input type="number" min={0} max={100} />

// File input
<Input type="file" accept="image/*" />

// With error state
<Input
  type="email"
  className="border-red-500 text-red-500"
  placeholder="Enter email"
/>

// Disabled state
<Input disabled placeholder="Cannot edit" />
```

#### Accessibility

- Proper labeling support
- Focus management
- Error message association
- Screen reader compatibility
- Keyboard navigation
- ARIA attributes support

#### Best Practices

1. **Form Usage**

   - Always use with form labels
   - Provide clear placeholder text
   - Include validation feedback
   - Use appropriate input types
   - Handle error states properly

2. **Accessibility**

   - Associate with labels using htmlFor
   - Provide aria-describedby for errors
   - Use required attribute appropriately
   - Include validation messages
   - Support keyboard navigation

3. **Styling**

   - Maintain consistent heights
   - Use theme variables
   - Follow spacing guidelines
   - Handle responsive widths
   - Support dark/light modes

4. **Validation**
   - Use HTML5 validation attributes
   - Provide clear error messages
   - Show validation state
   - Handle custom validation
   - Support form-level validation

#### Integration Example

```tsx
import { Input } from '~/components/ui/Input';
import { Label } from '~/components/ui/Label';

function FormField({
  label,
  error,
  ...props
}: {
  label: string;
  error?: string;
} & InputProps) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-describedby={error ? `${id}-error` : undefined}
        className={error ? 'border-red-500' : undefined}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Dialog (`Dialog.tsx`)

A flexible dialog component built on top of Radix UI's Dialog primitive with motion animations and theme support.

#### Exports

```typescript
export interface DialogProps {
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  onBackdrop?: () => void;
}

export interface DialogButtonProps {
  type: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  disabled?: boolean;
}

export const Dialog: React.FC<DialogProps>;
export const DialogButton: React.FC<DialogButtonProps>;
export const DialogTitle: React.FC<RadixDialog.DialogTitleProps>;
export const DialogDescription: React.FC<RadixDialog.DialogDescriptionProps>;
export const DialogClose: typeof RadixDialog.Close;
export const DialogRoot: typeof RadixDialog.Root;
```

#### Features

- Modal dialog with backdrop
- Animated transitions
- Focus management
- Keyboard navigation (Esc to close)
- Theme-aware styling
- Custom close button
- Flexible content layout
- Multiple button variants
- Responsive design

#### Button Types

- `primary`: Purple background, white text
- `secondary`: Transparent with hover effect
- `danger`: Red text with hover effect

#### Styling

The dialog uses CSS variables for theming:

- `--bolt-elements-textPrimary`: Title text color
- `--bolt-elements-textSecondary`: Description text color
- `--bolt-elements-background`: Dialog background
- `--bolt-elements-border`: Border color

#### Usage

```tsx
import { Dialog, DialogRoot, DialogTitle, DialogDescription, DialogButton, DialogClose } from '~/components/ui/Dialog';

function MyDialog() {
  return (
    <DialogRoot>
      <Dialog showCloseButton onClose={() => console.log('closed')}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>Are you sure you want to proceed with this action?</DialogDescription>

        <div className="mt-4 flex gap-3">
          <DialogClose asChild>
            <DialogButton type="secondary">Cancel</DialogButton>
          </DialogClose>

          <DialogButton type="primary" onClick={() => handleConfirm()}>
            Confirm
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
```

#### Animations

The dialog uses Framer Motion for smooth transitions:

- Fade in/out backdrop
- Scale and fade for dialog content
- Smooth easing functions
- Exit animations

#### Accessibility

- Focus trap within dialog
- ARIA role="dialog"
- ARIA labeling
- Keyboard navigation
- Screen reader support
- Focus restoration

#### Best Practices

1. **Content Structure**

   - Use clear titles
   - Provide descriptive text
   - Organize actions logically
   - Keep content concise
   - Use appropriate button types

2. **User Experience**

   - Handle close events
   - Provide clear actions
   - Support keyboard shortcuts
   - Show loading states
   - Prevent background interaction

3. **Accessibility**

   - Label all interactive elements
   - Maintain focus management
   - Support screen readers
   - Handle keyboard navigation
   - Provide ARIA attributes

4. **Responsive Design**
   - Adapt to screen sizes
   - Handle mobile views
   - Manage content overflow
   - Support touch interactions
   - Consider viewport changes

#### Integration Example

```tsx
function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <Dialog showCloseButton>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>

        <div className="mt-4 flex justify-end gap-3">
          <DialogClose asChild>
            <DialogButton type="secondary">Cancel</DialogButton>
          </DialogClose>

          <DialogButton
            type="primary"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Confirm
          </DialogButton>
        </div>
      </Dialog>
    </DialogRoot>
  );
}
```

### Dropdown (`Dropdown.tsx`)

A flexible dropdown menu component built on top of Radix UI's DropdownMenu primitive with animations and theme support.

#### Exports

```typescript
export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
}

export interface DropdownItemProps {
  children: ReactNode;
  onSelect?: () => void;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps>;
export const DropdownItem: React.FC<DropdownItemProps>;
export const DropdownSeparator: React.FC;
```

#### Features

- Customizable trigger element
- Multiple alignment options
- Animated transitions
- Theme-aware styling
- Keyboard navigation
- Item selection handling
- Separator support
- Portal rendering
- Focus management

#### Alignment Options

- `start`: Align to start of trigger
- `center`: Center align with trigger
- `end`: Align to end of trigger (default)

#### Styling

The dropdown uses CSS variables for theming:

- `--bolt-elements-textPrimary`: Item text color
- `--bolt-elements-background-depth-2`: Dropdown background
- `--bolt-elements-background-depth-3`: Item hover background
- `--bolt-elements-borderColor`: Border and separator color

#### Usage

```tsx
import { Dropdown, DropdownItem, DropdownSeparator } from '~/components/ui/Dropdown';

function MyDropdown() {
  return (
    <Dropdown trigger={<button>Open Menu</button>} align="start" sideOffset={8}>
      <DropdownItem onSelect={() => console.log('Edit')}>Edit</DropdownItem>

      <DropdownItem onSelect={() => console.log('Duplicate')}>Duplicate</DropdownItem>

      <DropdownSeparator />

      <DropdownItem onSelect={() => console.log('Delete')} className="text-red-500 hover:text-red-600">
        Delete
      </DropdownItem>
    </Dropdown>
  );
}
```

#### Animations

The dropdown uses CSS animations for smooth transitions:

- Fade in/out
- Scale in/out
- Slide animations based on position
- Smooth easing functions

#### Accessibility

- Keyboard navigation (arrow keys)
- Focus management
- ARIA attributes
- Screen reader support
- Type-ahead functionality
- Escape to close

#### Best Practices

1. **Content Structure**

   - Group related items
   - Use separators logically
   - Keep items concise
   - Provide clear actions
   - Use consistent styling

2. **User Experience**

   - Handle selection events
   - Provide visual feedback
   - Support keyboard shortcuts
   - Show loading states
   - Close on selection

3. **Accessibility**

   - Label all items
   - Maintain focus
   - Support screen readers
   - Handle keyboard input
   - Provide ARIA labels

4. **Responsive Design**
   - Handle overflow
   - Adjust positioning
   - Support touch
   - Consider viewport edges
   - Manage long content

#### Integration Example

```tsx
function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
          <span>{user.name}</span>
        </button>
      }
    >
      <DropdownItem onSelect={() => navigate('/profile')}>Profile Settings</DropdownItem>

      <DropdownItem onSelect={() => navigate('/preferences')}>Preferences</DropdownItem>

      <DropdownSeparator />

      <DropdownItem onSelect={onSignOut} className="text-red-500 hover:text-red-600">
        Sign Out
      </DropdownItem>
    </Dropdown>
  );
}
```

### Switch (`Switch.tsx`)

A toggle switch component built on top of Radix UI's Switch primitive with smooth transitions and theme support.

#### Exports

```typescript
export interface SwitchProps {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (event: boolean) => void;
}

export const Switch: React.FC<SwitchProps>;
```

#### Features

- Controlled and uncontrolled modes
- Smooth transitions
- Focus management
- Theme-aware styling
- Keyboard navigation
- Disabled state support
- Custom styling support
- Accessibility built-in

#### Styling

The switch uses CSS variables for theming:

- `--bolt-elements-button-primary-background`: Unchecked background
- `--bolt-elements-item-contentAccent`: Checked background
- Custom shadow and transition effects
- Focus ring styling

#### States

- **Unchecked**: Default state with primary background
- **Checked**: Accent background with translated thumb
- **Focused**: Blue ring with offset
- **Disabled**: Reduced opacity with not-allowed cursor

#### Usage

```tsx
import { Switch } from '~/components/ui/Switch';

// Basic usage
function ToggleSwitch() {
  const [enabled, setEnabled] = useState(false);

  return <Switch checked={enabled} onCheckedChange={setEnabled} />;
}

// With label
function LabeledSwitch() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Switch checked={enabled} onCheckedChange={setEnabled} />
      <span className="text-sm">{enabled ? 'Enabled' : 'Disabled'}</span>
    </div>
  );
}

// Disabled state
function DisabledSwitch() {
  return <Switch checked={true} disabled className="opacity-50 cursor-not-allowed" />;
}
```

#### Animations

The switch uses CSS transitions for smooth state changes:

- Background color transition
- Thumb translation
- Focus ring transition
- Smooth easing functions

#### Accessibility

- Keyboard focus management
- ARIA switch role
- ARIA checked state
- Screen reader support
- Keyboard activation (Space)
- Focus visible styling

#### Best Practices

1. **State Management**

   - Use controlled mode for complex forms
   - Handle state changes properly
   - Provide clear feedback
   - Maintain consistent state
   - Consider form context

2. **User Experience**

   - Provide visual feedback
   - Use clear labels
   - Support keyboard input
   - Show loading states
   - Handle errors gracefully

3. **Accessibility**

   - Label switches properly
   - Group related switches
   - Maintain focus states
   - Support screen readers
   - Use ARIA attributes

4. **Styling**
   - Follow color guidelines
   - Maintain consistent sizes
   - Use proper spacing
   - Handle dark mode
   - Consider mobile touch targets

#### Integration Example

```tsx
function FeatureToggle({
  feature,
  onChange,
}: {
  feature: {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
  };
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{feature.name}</div>
        <div className="text-sm text-gray-500">{feature.description}</div>
      </div>

      <Switch checked={feature.enabled} onCheckedChange={onChange} className="mt-1" />
    </div>
  );
}
```

### Tabs (`Tabs.tsx`)

A flexible tabbed interface component built on top of Radix UI's Tabs primitive with theme support and accessibility features.

#### Exports

```typescript
export const Tabs: typeof TabsPrimitive.Root;
export const TabsList: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>;
export const TabsTrigger: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>;
export const TabsContent: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>;
```

#### Features

- Compound component pattern
- Keyboard navigation
- Focus management
- Theme-aware styling
- Active state handling
- Disabled state support
- Custom styling support
- Accessibility built-in
- Responsive design

#### Styling

The tabs use CSS variables for theming:

- `--bolt-elements-background`: Tab background
- `--bolt-elements-textSecondary`: Inactive tab text
- `--bolt-elements-textPrimary`: Active tab text
- `--bolt-elements-ring`: Focus ring color

#### States

- **Default**: Secondary text color
- **Active**: Primary text with background and shadow
- **Hover**: Subtle background change
- **Focus**: Ring with offset
- **Disabled**: Reduced opacity

#### Usage

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/Tabs';

function TabsExample() {
  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings" disabled>
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="account">
        <h3>Account Settings</h3>
        {/* Account settings content */}
      </TabsContent>

      <TabsContent value="password">
        <h3>Change Password</h3>
        {/* Password change form */}
      </TabsContent>

      <TabsContent value="settings">
        <h3>Preferences</h3>
        {/* Settings content */}
      </TabsContent>
    </Tabs>
  );
}
```

#### Accessibility

- Proper ARIA roles
- Keyboard navigation
- Focus management
- Screen reader support
- Active state announcements
- Disabled state handling

#### Best Practices

1. **Content Organization**

   - Group related content
   - Use clear tab labels
   - Keep content focused
   - Handle loading states
   - Consider mobile views

2. **User Experience**

   - Maintain tab order
   - Show active state clearly
   - Support keyboard navigation
   - Handle content transitions
   - Preserve scroll position

3. **Accessibility**

   - Use descriptive labels
   - Maintain focus order
   - Support screen readers
   - Handle keyboard input
   - Provide ARIA labels

4. **Styling**
   - Follow design system
   - Use consistent heights
   - Handle overflow
   - Support responsive layouts
   - Consider mobile touch targets

#### Integration Example

```tsx
function SettingsTabs({
  sections,
}: {
  sections: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    content: ReactNode;
    disabled?: boolean;
  }>;
}) {
  return (
    <Tabs defaultValue={sections[0].id}>
      <TabsList className="w-full border-b">
        {sections.map((section) => (
          <TabsTrigger
            key={section.id}
            value={section.id}
            disabled={section.disabled}
            className="flex items-center gap-2"
          >
            {section.icon}
            <span>{section.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {sections.map((section) => (
        <TabsContent key={section.id} value={section.id} className="p-4">
          {section.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
```

### ScrollArea (`ScrollArea.tsx`)

A custom scrollable container component built on top of Radix UI's ScrollArea primitive with custom scrollbar styling and touch support.

#### Exports

```typescript
export const ScrollArea: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>;
export const ScrollBar: React.ForwardRefExoticComponent<
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>;
```

#### Features

- Custom scrollbar styling
- Touch device support
- Horizontal and vertical scrolling
- Smooth scrolling
- Theme-aware styling
- Corner handling
- Responsive design
- Accessibility support
- Viewport management

#### Styling

The scroll area uses CSS variables for theming:

- `--bolt-elements-border`: Scrollbar thumb color
- Custom transitions and animations
- Responsive sizing
- Touch-friendly dimensions

#### Props

- `orientation`: 'vertical' | 'horizontal'
- `className`: Custom class names
- All standard ScrollArea props from Radix UI

#### Usage

```tsx
import { ScrollArea } from '~/components/ui/ScrollArea';

// Basic usage
function ScrollableContent() {
  return (
    <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
      <div className="space-y-4">
        {/* Content that might overflow */}
        <h4>Section 1</h4>
        <p>Some content that might overflow...</p>
        <h4>Section 2</h4>
        <p>More content that might overflow...</p>
      </div>
    </ScrollArea>
  );
}

// With both scrollbars
function TwoDimensionalScroll() {
  return (
    <ScrollArea className="h-[400px] w-[600px]">
      <div className="h-[800px] w-[800px] p-4">{/* Content that overflows in both directions */}</div>
    </ScrollArea>
  );
}

// Custom scrollbar styling
function CustomScrollbar() {
  return (
    <ScrollArea className="h-[300px]" scrollBarClassName="bg-gray-100 hover:bg-gray-200">
      {/* Content */}
    </ScrollArea>
  );
}
```

#### Accessibility

- Keyboard scrolling support
- Screen reader compatibility
- Focus management
- ARIA attributes
- Touch device support
- Scroll announcements

#### Best Practices

1. **Content Management**

   - Handle overflow gracefully
   - Provide clear boundaries
   - Consider content updates
   - Manage scroll position
   - Handle dynamic content

2. **User Experience**

   - Smooth scrolling
   - Clear scroll indicators
   - Touch-friendly targets
   - Responsive behavior
   - Performance optimization

3. **Accessibility**

   - Keyboard navigation
   - Screen reader support
   - Focus containment
   - Scroll announcements
   - Touch gestures

4. **Styling**
   - Consistent scrollbar size
   - Clear visual feedback
   - Theme compatibility
   - Mobile considerations
   - High DPI support

#### Integration Example

```tsx
function ContentPanel({
  title,
  children,
  maxHeight = '400px',
}: {
  title: string;
  children: ReactNode;
  maxHeight?: string;
}) {
  return (
    <div className="rounded-lg border">
      <div className="border-b p-4">
        <h3 className="font-medium">{title}</h3>
      </div>

      <ScrollArea className={classNames('p-4', maxHeight && `max-h-[${maxHeight}]`)}>
        <div className="space-y-4">{children}</div>
      </ScrollArea>
    </div>
  );
}
```

### Card (`Card.tsx`)

A flexible card component that provides a container with consistent styling and structure for content organization.

#### Exports

```typescript
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.ForwardRefExoticComponent<CardProps>;
export const CardHeader: React.ForwardRefExoticComponent<CardProps>;
export const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement>>;
export const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement>>;
export const CardContent: React.ForwardRefExoticComponent<CardProps>;
export const CardFooter: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement>>;
```

#### Features

- Compound component pattern
- Consistent spacing
- Theme-aware styling
- Border and shadow effects
- Rounded corners
- Flexible content areas
- Header/footer organization
- Title and description support
- Custom styling support

#### Styling

The card uses CSS variables for theming:

- `--bolt-elements-borderColor`: Card border color
- `--bolt-elements-background-depth-1`: Card background
- `--bolt-elements-textPrimary`: Primary text color
- `--bolt-elements-textSecondary`: Secondary text color

#### Components

- **Card**: Main container component
- **CardHeader**: Header section with spacing
- **CardTitle**: Title element with typography
- **CardDescription**: Description text with styling
- **CardContent**: Main content area
- **CardFooter**: Footer section with spacing

#### Usage

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/Card';

// Basic usage
function SimpleCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description of the card content.</CardDescription>
      </CardHeader>

      <CardContent>
        <p>Main content goes here...</p>
      </CardContent>

      <CardFooter>
        <button>Action</button>
      </CardFooter>
    </Card>
  );
}

// Interactive card
function InteractiveCard() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
      </CardHeader>

      <CardContent>
        <p>Hover to see shadow effect...</p>
      </CardContent>
    </Card>
  );
}

// Custom styled card
function CustomCard() {
  return (
    <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      <CardHeader>
        <CardTitle className="text-white">Custom Styled</CardTitle>
      </CardHeader>

      <CardContent>
        <p>Content with custom background...</p>
      </CardContent>
    </Card>
  );
}
```

#### Best Practices

1. **Content Structure**

   - Use consistent spacing
   - Follow visual hierarchy
   - Group related content
   - Maintain padding
   - Consider content flow

2. **Visual Design**

   - Consistent elevation
   - Clear boundaries
   - Proper spacing
   - Responsive sizing
   - Theme consistency

3. **Accessibility**

   - Semantic structure
   - Proper headings
   - Focus management
   - Color contrast
   - Screen reader support

4. **Responsive Design**
   - Mobile-first approach
   - Flexible widths
   - Content wrapping
   - Image handling
   - Touch targets

#### Integration Example

```tsx
function FeatureCard({
  feature,
}: {
  feature: {
    title: string;
    description: string;
    icon: ReactNode;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}) {
  return (
    <Card className="hover:shadow-lg transition-all">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">{feature.icon}</div>

          <CardTitle>{feature.title}</CardTitle>
        </div>

        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>

      <CardContent>{/* Additional content */}</CardContent>

      {feature.action && (
        <CardFooter>
          <button onClick={feature.action.onClick} className="text-sm text-purple-600 hover:text-purple-700">
            {feature.action.label}
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
```

### Label (`Label.tsx`)

A form label component built on top of Radix UI's Label primitive with support for form control association and accessibility features.

#### Exports

```typescript
export const Label: React.ForwardRefExoticComponent<React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>;
```

#### Features

- Form control association
- Peer element styling
- Disabled state handling
- Theme-aware styling
- Font customization
- Leading control
- Accessibility support
- Custom styling support

#### Styling

The label uses CSS variables and utility classes:

- Font size: text-sm
- Font weight: font-medium
- Line height: leading-none
- Disabled state opacity: opacity-70
- Cursor handling for disabled peers

#### Usage

```tsx
import { Label } from '~/components/ui/Label';

// Basic usage
function FormField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Name</Label>
      <input id="name" type="text" />
    </div>
  );
}

// With required field
function RequiredField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email" className="after:content-['*'] after:ml-0.5 after:text-red-500">
        Email
      </Label>
      <input id="email" type="email" required />
    </div>
  );
}

// With disabled state
function DisabledField() {
  return (
    <div className="space-y-2">
      <Label htmlFor="disabled" className="text-gray-500">
        Disabled Field
      </Label>
      <input id="disabled" disabled />
    </div>
  );
}
```

#### Accessibility

- Proper label-for association
- Screen reader support
- Keyboard focus handling
- ARIA attributes
- Required field indication
- Disabled state handling

#### Best Practices

1. **Form Association**

   - Use htmlFor attribute
   - Match input IDs
   - Group related fields
   - Handle required states
   - Support validation

2. **Visual Design**

   - Clear typography
   - Consistent spacing
   - Required indicators
   - Error states
   - Disabled styling

3. **Accessibility**

   - Proper associations
   - Clear instructions
   - Error messages
   - Required fields
   - Focus management

4. **Content Guidelines**
   - Clear, concise text
   - Consistent casing
   - Helpful hints
   - Error clarity
   - Action labels

#### Integration Example

```tsx
function FormGroup({
  label,
  required,
  error,
  children,
  helpText,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  helpText?: string;
}) {
  const id = useId();

  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className={classNames(
          required && "after:content-['*'] after:ml-0.5 after:text-red-500",
          error && 'text-red-500',
        )}
      >
        {label}
      </Label>

      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': error ? `${id}-error` : helpText ? `${id}-help` : undefined,
        'aria-invalid': error ? true : undefined,
        required,
      })}

      {helpText && !error && (
        <p id={`${id}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
```

### Badge (`Badge.tsx`)

A versatile badge component for displaying status, labels, and counts with multiple variants and theme support.

#### Exports

```typescript
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge: React.FC<BadgeProps>;
export const badgeVariants: (props: BadgeProps) => string;
```

#### Features

- Multiple variants
- Theme-aware styling
- Focus management
- Border customization
- Font control
- Transition effects
- Hover states
- Custom styling support
- Responsive design

#### Variants

- `default`: Primary background with primary text
- `secondary`: Primary background with secondary text
- `destructive`: Red background with red text
- `outline`: Transparent with border

#### Styling

The badge uses CSS variables for theming:

- `--bolt-elements-background`: Badge background
- `--bolt-elements-textPrimary`: Primary text color
- `--bolt-elements-textSecondary`: Secondary text color
- `--bolt-elements-ring`: Focus ring color

#### Usage

```tsx
import { Badge } from '~/components/ui/Badge';

// Basic usage
function BasicBadge() {
  return <Badge>New</Badge>;
}

// With variants
function VariantBadges() {
  return (
    <div className="space-x-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Error</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}

// With custom styling
function CustomBadge() {
  return (
    <Badge variant="outline" className="border-2 border-purple-500 text-purple-500">
      Custom
    </Badge>
  );
}
```

#### Best Practices

1. **Visual Design**

   - Use appropriate variants
   - Maintain consistency
   - Consider contrast
   - Keep text concise
   - Handle overflow

2. **Content Guidelines**

   - Short, clear text
   - Consistent terminology
   - Meaningful labels
   - Proper capitalization
   - Number formatting

3. **Accessibility**

   - Proper contrast
   - Clear meaning
   - Screen reader support
   - Focus states
   - ARIA labels

4. **Usage Context**
   - Status indicators
   - Category labels
   - Count displays
   - Feature flags
   - Version tags

#### Integration Example

```tsx
function FeatureStatus({
  feature,
}: {
  feature: {
    name: string;
    status: 'stable' | 'beta' | 'deprecated';
    isNew?: boolean;
  };
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{feature.name}</span>

      {feature.isNew && (
        <Badge variant="default" className="bg-green-500/10 text-green-500">
          New
        </Badge>
      )}

      <Badge
        variant={feature.status === 'stable' ? 'default' : feature.status === 'beta' ? 'secondary' : 'destructive'}
      >
        {feature.status}
      </Badge>
    </div>
  );
}

// Usage
function FeatureList() {
  return (
    <div className="space-y-2">
      <FeatureStatus
        feature={{
          name: 'Dark Mode',
          status: 'stable',
        }}
      />

      <FeatureStatus
        feature={{
          name: 'AI Assistant',
          status: 'beta',
          isNew: true,
        }}
      />

      <FeatureStatus
        feature={{
          name: 'Legacy Export',
          status: 'deprecated',
        }}
      />
    </div>
  );
}
```

### Progress (`Progress.tsx`)

A progress indicator component that provides visual feedback for loading states and progress tracking.

#### Exports

```typescript
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

export const Progress: React.ForwardRefExoticComponent<ProgressProps>;
```

#### Features

- Smooth transitions
- Theme-aware styling
- Custom value support
- Rounded corners
- Overflow handling
- Custom sizing
- Background customization
- Accessibility support
- Responsive design

#### Styling

The progress bar uses CSS variables for theming:

- `--bolt-elements-background`: Track background
- `--bolt-elements-textPrimary`: Progress indicator color
- Custom transitions and transforms
- Responsive sizing

#### Usage

```tsx
import { Progress } from '~/components/ui/Progress';

// Basic usage
function BasicProgress() {
  return <Progress value={60} />;
}

// With custom styling
function CustomProgress() {
  return <Progress value={75} className="h-3 bg-gray-100" />;
}

// Animated progress
function AnimatedProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <Progress value={progress} />;
}
```

#### Best Practices

1. **Visual Design**

   - Clear progress indication
   - Smooth animations
   - Appropriate sizing
   - Consistent styling
   - Loading states

2. **User Experience**

   - Show progress clearly
   - Provide context
   - Handle edge cases
   - Smooth transitions
   - Loading feedback

3. **Accessibility**

   - ARIA attributes
   - Progress updates
   - Screen reader support
   - Color contrast
   - State changes

4. **Implementation**
   - Value validation
   - Error handling
   - Performance
   - Animation control
   - State management

#### Integration Example

```tsx
function FileUpload({ file, onComplete }: { file: File; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');

  useEffect(() => {
    if (status !== 'uploading') return;

    const upload = async () => {
      try {
        // Simulated upload with progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((r) => setTimeout(r, 500));
          setProgress(i);
        }

        setStatus('complete');
        onComplete();
      } catch (error) {
        setStatus('error');
      }
    };

    upload();
  }, [status, onComplete]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">{file.name}</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>

      <Progress
        value={progress}
        className={classNames(
          'h-2',
          status === 'error' && 'bg-red-100 [&>div]:bg-red-500',
          status === 'complete' && 'bg-green-100 [&>div]:bg-green-500',
        )}
      />

      {status === 'error' && <p className="text-sm text-red-500">Upload failed. Please try again.</p>}
    </div>
  );
}
```

### LoadingDots (`LoadingDots.tsx`)

A simple animated loading indicator that displays dots in sequence after text.

#### Exports

```typescript
interface LoadingDotsProps {
  text: string;
}

export const LoadingDots: React.NamedExoticComponent<LoadingDotsProps>;
```

#### Features

- Animated loading dots
- Custom text support
- Memoized for performance
- Centered layout
- Automatic animation
- Clean unmounting
- Consistent timing
- Responsive design
- Flexible styling
- Proper spacing

#### Styling

The component uses utility classes for layout:

- Flexbox centering
- Full height support
- Relative positioning
- Invisible placeholder
- Custom spacing

#### Usage

```tsx
import { LoadingDots } from '~/components/ui/LoadingDots';

// Basic usage
function BasicLoading() {
  return <LoadingDots text="Loading" />;
}

// Custom text
function CustomLoading() {
  return <LoadingDots text="Processing" />;
}

// In a button
function LoadingButton() {
  return (
    <button disabled className="px-4 py-2 rounded-lg bg-purple-500 text-white">
      <LoadingDots text="Saving" />
    </button>
  );
}
```

#### Best Practices

1. **Visual Design**

   - Clear loading state
   - Consistent animation
   - Proper spacing
   - Text alignment
   - Dot visibility

2. **User Experience**

   - Meaningful text
   - Smooth animation
   - Clear indication
   - Proper timing
   - Context awareness

3. **Accessibility**

   - Loading announcements
   - Screen reader support
   - Focus management
   - ARIA attributes
   - Text alternatives

4. **Implementation**
   - Proper cleanup
   - Memory management
   - Animation timing
   - Component memoization
   - Efficient updates

#### Integration Example

```tsx
function AsyncOperation({ operation, onComplete }: { operation: () => Promise<void>; onComplete: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle');

  const handleOperation = async () => {
    try {
      setStatus('loading');
      await operation();
      setStatus('complete');
      onComplete();
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleOperation}
        disabled={status === 'loading'}
        className={classNames('w-full px-4 py-2 rounded-lg', 'bg-purple-500 text-white', 'disabled:opacity-50')}
      >
        {status === 'loading' ? (
          <LoadingDots text="Processing" />
        ) : status === 'error' ? (
          'Try Again'
        ) : status === 'complete' ? (
          'Complete'
        ) : (
          'Start Operation'
        )}
      </button>

      {status === 'error' && <p className="text-sm text-red-500">Operation failed. Please try again.</p>}
    </div>
  );
}
```

### LoadingOverlay (`LoadingOverlay.tsx`)

A full-screen loading overlay component that displays a loading spinner, message, and optional progress bar.

#### Exports

```typescript
export interface LoadingOverlayProps {
  message?: string;
  progress?: number;
  progressText?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps>;
```

#### Features

- Full-screen overlay
- Backdrop blur effect
- Loading spinner animation
- Custom message support
- Progress bar support
- Progress text support
- Theme-aware styling
- Centered layout
- Shadow effects
- Responsive design

#### Styling

The overlay uses CSS variables for theming:

- `--bolt-elements-background-depth-2`: Overlay background
- `--bolt-elements-loader-progress`: Progress bar color
- `--bolt-elements-textTertiary`: Text color
- Custom transitions and animations

#### Usage

```tsx
import { LoadingOverlay } from '~/components/ui/LoadingOverlay';

// Basic usage
function BasicOverlay() {
  return <LoadingOverlay />;
}

// With custom message
function CustomMessageOverlay() {
  return <LoadingOverlay message="Preparing your download..." />;
}

// With progress
function ProgressOverlay() {
  return <LoadingOverlay message="Uploading files" progress={75} progressText="3 of 4 files uploaded" />;
}
```

#### Best Practices

1. **Visual Design**

   - Clear loading indication
   - Readable message text
   - Appropriate spacing
   - Consistent styling
   - Proper backdrop

2. **User Experience**

   - Block interactions properly
   - Show meaningful progress
   - Provide clear context
   - Handle transitions
   - Prevent scrolling

3. **Accessibility**

   - Loading announcements
   - Progress updates
   - Screen reader support
   - Focus management
   - ARIA attributes

4. **Implementation**
   - Handle mounting/unmounting
   - Manage z-index
   - Control backdrop
   - Update progress smoothly
   - Cleanup properly

#### Integration Example

```tsx
function FileUploader({ files, onComplete }: { files: File[]; onComplete: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleUpload = async () => {
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        // Simulated file upload
        await new Promise((r) => setTimeout(r, 1000));
        setUploadedCount(i + 1);
        setProgress(((i + 1) / files.length) * 100);
      }

      onComplete();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button onClick={handleUpload} disabled={isUploading} className="px-4 py-2 rounded-lg bg-purple-500 text-white">
        Upload {files.length} Files
      </button>

      {isUploading && (
        <LoadingOverlay
          message="Uploading Files"
          progress={progress}
          progressText={`${uploadedCount} of ${files.length} files uploaded`}
        />
      )}
    </>
  );
}
```

## Dependencies

- framer-motion
- @radix-ui/react-\*
- react-toastify
- UnoCSS
- And more...

Detailed documentation of exports and functionality will be added in subsequent updates.

```

```
