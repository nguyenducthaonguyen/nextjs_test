# Next.js Development Guide

## Project Overview

Tài liệu hướng dẫn toàn diện này phác thảo các thực tiễn tốt nhất, quy ước và tiêu chuẩn cho việc phát triển với các công nghệ web hiện đại như ReactJS, NextJS, TypeScript, JavaScript, HTML, CSS và các UI framework. Tài liệu nhấn mạnh việc viết mã sạch, dễ bảo trì và có khả năng mở rộng, tuân thủ các nguyên tắc SOLID và các mô hình lập trình function.

## Tech Stack

- **Frontend Framework**: Next.js 15+ với App Router
- **UI Library**: React 19+ với TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4, Shadcn UI, Radix UI
- **Form Handling**: React Hook Form + Zod validation
- **Data Sanitization**: DOMPurify
- **Internationalization**: next-intl
- **Testing**: Vitest, React Testing Library, Playwright
- **Code Quality**: ESLint + Prettier + TypeScript strict mode

## Development Guidelines

### Development Philosophy

- Clean code, dễ bảo trì và có khả năng mở rộng
- Tuân thủ các nguyên tắc SOLID
- Ưu tiên mô hình functional và declarative programming thay vì mô hình imperative
- Đề cao tính an toàn kiểu và khả năng phân tích tĩnh
- Thực hành phát triển theo hướng component

### Code Implementation Guidelines

#### Planning Phase

- Bắt đầu với kế hoạch từng bước cụ thể
- Viết pseudocode chi tiết trước khi triển khai
- Tài liệu hóa kiến trúc component và luồng dữ liệu
- Xem xét các trường hợp biên và kịch bản lỗi

#### Code Style Standards

- Dùng tab để thụt đầu dòng (2 spaces mỗi tab)
- Dùng dấu nháy đơn cho chuỗi (trừ trường hợp cần tránh escape)
- Bỏ dấu chấm phẩy (trừ khi cần để tránh nhập nhằng)
- Loại bỏ biến không dùng
- Thêm khoảng trắng sau từ khóa
- Thêm khoảng trắng trước dấu ngoặc đơn của khai báo function
- Luôn dùng so sánh nghiêm ngặt === thay vì so sánh lỏng ==
- Thêm khoảng trắng quanh các toán tử trung tố
- Thêm khoảng trắng sau dấu phẩy
- Giữ từ khóa else trên cùng dòng với dấu ngoặc nhọn đóng
- Dùng dấu ngoặc nhọn cho các câu lệnh if nhiều dòng
- Luôn xử lý tham số lỗi trong callback
- Giới hạn độ dài dòng ở 80 ký tự
- Dùng dấu phẩy cuối cho object/array literal nhiều dòng
- Absolute Imports sử dụng `@` prefix

### Naming Conventions

#### General Rules

- **PascalCase cho**: Component, định nghĩa Type, Interface
- **kebab-case cho**: Tên thư mục (ví dụ: components/auth-wizard), tên file (ví dụ: user-profile.tsx)
- **camelCase cho**: Biến, function, phương thức, hook, thuộc tính, props
- **UPPERCASE cho**: Biến môi trường, hằng số, cấu hình toàn cục

#### Specific Naming Patterns

- Tiền tố các event handler bằng 'handle': `handleClick`, `handleSubmit`
- Tiền tố biến boolean bằng động từ: `isLoading`, `hasError`, `canSubmit`
- Tiền tố custom hook bằng 'use': `useAuth`, `useForm`
- Ưu tiên từ đầy đủ thay vì viết tắt, trừ các trường hợp:
  - err (error)
  - req (request)
  - res (response)
  - props (properties)
  - ref (reference)

## Environment Setup

### Development Requirements

- Node.js >= 22.16.0
- npm >= 10.9.0
- TypeScript >= 5.9.2

### Environment Variables Configuration

```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Core Feature Implementation

### React Component Best Practices

#### Component Architecture

- Dùng functional component với TypeScript interface
- Định nghĩa component bằng từ khóa function
- Tách logic tái sử dụng thành custom hook
- Thực thi composition component hợp lý
- Dùng React.memo() một cách chiến lược để tối ưu hiệu năng
- Dọn dẹp đúng cách trong useEffect

```tsx
// Ví dụ: User Profile Component
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export function UserProfile({ userId, onUpdate }: UserProfileProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, startFetching] = useTransition();

  useEffect(() => {

    startFetching(async () => {
      const fetchedUser = await fetchUserById(userId);
      setUser(fetchedUser);
      onUpdate?.(fetchedUser);
    });
  }, [userId]);

  if (isFetching) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

#### React Performance Optimization

- Dùng useCallback để memo hóa function callback
- Áp dụng useMemo cho các phép tính tốn kém
- Tránh định nghĩa function inline trong JSX
- Chia nhỏ bundle bằng dynamic import
- Dùng key phù hợp cho danh sách (tránh dùng index làm key)
- Sử dụng useTransition cho state update không khẩn cấp
- Dùng useOptimistic cho trải nghiệm UI mượt mà

```tsx
import { memo, useMemo, useCallback } from "react";

interface UserListProps {
  users: User[];
  onUserSelect: (userId: string) => void;
}

export const UserList = memo(({ users, onUserSelect }: UserListProps) => {
  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);

  const handleUserClick = useCallback(
    (userId: string) => {
      onUserSelect(userId);
    },
    [onUserSelect]
  );

  return (
    <div className="user-list">
      {sortedUsers.map((user) => (
        <div
          key={user.id}
          onClick={() => handleUserClick(user.id)}
          className="user-item"
        >
          {user.name}
        </div>
      ))}
    </div>
  );
});
```

### Next.js Best Practices

#### Core Concepts

- Tận dụng App Router để điều hướng
- Quản lý metadata chuẩn xác
- Áp dụng chiến lược caching phù hợp
- Cài đặt error boundary đúng chỗ

#### Components and Features

- Dùng các component tích hợp của Next.js:
  - Image để tối ưu hình ảnh
  - Link cho điều hướng phía client
  - Script cho script bên ngoài
  - Head cho metadata
- Xây dựng trạng thái loading hợp lý
- Sử dụng phương thức lấy dữ liệu chuẩn

#### Server Components

- Mặc định dùng Server Component
- Tận dụng query parameter của URL để fetch dữ liệu và quản lý server state
- Chỉ dùng chỉ thị 'use client' khi thực sự cần:
  - Lắng nghe sự kiện
  - Truy cập Browser API
  - Quản lý state phía client
  - Thư viện chỉ chạy phía client

```tsx
// Ví dụ: Server Component với data fetching
interface PostsPageProps {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { page, category } = await searchParams;
  const currentPage = Number(page) || 1;
  const currentCategory = category || "all";

  const posts = await fetchPosts({ page, category });

  return (
    <div className="posts-page">
      <h1>Posts</h1>
      <PostsList posts={posts} />
      <Pagination currentPage={page} />
    </div>
  );
}
```

### Reusable Components

- Dự án hướng đến phát triển UI theo hướng modular và scalable thông qua việc phân tách rõ ràng các lớp component có thể tái sử dụng:

  - `src/components/ui`: Các UI component cấp thấp, nguyên tử (ví dụ: button, input, modal)
  - `src/components/templates`: Các component layout cấp cao hơn (ví dụ: headers, footers, dashboards)
  - `src/components/shared`: Các component chia sẻ được sử dụng trên nhiều tính năng (ví dụ: user avatar, notifications)
  - `src/components/[feature-name]`: Các component cụ thể cho tính năng được đóng gói trong thư mục riêng
  - `src/components/[feature-name]/shared`: Các component chia sẻ cụ thể cho một tính năng

- Tái sử dụng component giữa các feature để tăng tính nhất quán và giảm trùng lặp.
- Các shared component phải là pure component có tài liệu hướng dẫn sử dụng và ví dụ minh họa.
- Đọc tài liệu tại `src/docs/components/` để xem hướng dẫn và ví dụ sử dụng các shared component xem có phù hợp không hay cần điều chỉnh để sử dụng, sau đó mới tạo mới.

#### Server Actions & API Calls
- Dùng server action cho form submission, data fetching và data mutation.
- Lưu action trong thư mục `src/actions/`.
- Thực hiện API call thông qua `src/lib/http-client.ts` để đảm bảo xử lý lỗi và logging nhất quán.

```tsx
// Ví dụ: Server Action cho login

// src/actions/auth-action.ts
'use server'

import { Logger } from '@/lib/logger';
import { httpClient } from '@/lib/http-client';

const authLogger = Logger.create('AuthAction');

export async function updateProfile(data: FormData) {
  try {
    const headers = await getAuthHeaders();
    const response = await httpClient.put('/api/v1/auth/profile', data, { headers });

    if (response.success && response.data) {
      return { success: true, message: 'Profile updated successfully' };
    }

    return { success: false, message: 'Failed to update profile' };
  } catch (error: any) {
    authLogger.error('Error updating profile', error);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
}

// src/components/profile-form.tsx
'use client';

import { updateProfile } from './actions';

export default function ProfileForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      full_name: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    startTransition(async () => {
      const result = await updateProfile(data);

      if (result.success) {
        // Reset bằng giá trị hiện tại để xoá trạng thái dirty
        form.reset({ full_name: data.full_name });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    ...
  )
}
```

### TypeScript Implementation

- Bật strict mode
- Định nghĩa interface rõ ràng cho props và state của component
- Dùng type guard để xử lý an toàn các giá trị có thể undefined hoặc null
- Áp dụng generic cho function khi cần linh hoạt kiểu
- Tận dụng TypeScript utility type (Partial, Pick, Omit) để mã gọn gàng và tái sử dụng
- Ưu tiên interface hơn type khi mô tả cấu trúc object, đặc biệt khi cần mở rộng
- Sử dụng mapped type để tạo biến thể động từ type có sẵn

```tsx
// Ví dụ: TypeScript interface và type
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  createdAt: Date;
  updatedAt: Date;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserUpdateInput = Partial<Pick<User, "name" | "email" | "role">>;

// Ví dụ type guard
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "name" in obj &&
    "email" in obj
  );
}
```

## State Management

### Local State

- Dùng useState cho state cấp component
- Dùng useContext cho state dùng chung
- Khởi tạo state đúng cách

## UI and Styling

### Component Libraries

- UI được ghép từ các primitive của Shadcn/Radix trong `src/components/ui`
- Áp dụng pattern composition để tạo component mô-đun, tái sử dụng
- Kết hợp UI bằng các component sẵn có của Shadcn; mở rộng variant với pattern `class-variance-authority` (`src/components/ui/button.tsx`).

### Styling Guidelines

- Dùng Tailwind CSS cho phong cách utility-first dễ bảo trì
- Thiết kế theo nguyên tắc mobile-first, responsive để linh hoạt trên nhiều thiết bị
- Thiết lập dark mode bằng CSS variable hoặc tính năng dark mode của Tailwind
- Đảm bảo tỷ lệ tương phản màu thỏa tiêu chuẩn accessibility
- Tuân thủ chiến lược Tailwind token: định nghĩa token mới trong `src/styles/globals.css` và ghi lại trong `src/styles/DESIGN_SYSTEM.md` để dễ tùy biến và bảo trì
- Duy trì khoảng cách nhất quán để tạo nhịp điệu thị giác
- Dùng tiện ích `cn` để kết hợp class Tailwind và class điều kiện

```tsx
// Ví dụ: Styled component với Tailwind và dark mode
import type { VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive`,
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'>
  & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
```

### Layout Structure

LUÔN thiết kế mobile-first rồi mới nâng cấp cho màn hình lớn. Mọi quyết định layout phải ưu tiên trải nghiệm trên thiết bị di động.

**Cách Tiếp Cận Layout Bắt Buộc:**

1. Bắt đầu với thiết kế mobile (320px)
2. Thêm breakpoint cho tablet (768px)
3. Cuối cùng mới nâng cấp cho desktop (1024px+)
4. KHÔNG thiết kế desktop trước rồi thu nhỏ xuống


**Quy Tắc Triển Khai Layout:**
DO: Dùng khoảng trắng rộng rãi - tối thiểu 16px (space-4) giữa các phần
DO: Gom các phần tử liên quan trong phạm vi 8px (space-2)
DO: Canh chỉnh nhất quán (trái, giữa hoặc phải - chọn một cho mỗi phần)
DO: Dùng các giá trị max-width nhất quán: `max-w-sm`, `max-w-md`, `max-w-lg`, `max-w-xl`
DON'T: Dồn các phần tử quá sát nhau
DON'T: Trộn lẫn canh trái và phải trong cùng một phần

### Tailwind Implementation

Tuân theo các pattern Tailwind dưới đây. Sắp xếp ưu tiên theo thứ tự này khi ra quyết định layout.

**Thứ Tự Ưu Tiên Phương Pháp Layout (dùng theo thứ tự):**

1. Flexbox cho hầu hết layout: `flex items-center justify-between`
2. CSS Grid chỉ cho layout 2D phức tạp: ví dụ `grid grid-cols-3 gap-4`
3. KHÔNG dùng float hoặc absolute positioning trừ khi thật sự cần thiết


**Pattern Tailwind Bắt Buộc:**
DO: Dùng tiện ích gap để tạo khoảng cách: `gap-4`, `gap-x-2`, `gap-y-6`
DO: Ưu tiên gap-* hơn space-* để tạo khoảng trống
DO: Dùng class Tailwind có ngữ nghĩa: `items-center`, `justify-between`, `text-center`
DO: Dùng prefix responsive: `md:grid-cols-2`, `lg:text-xl`
DO: Dùng cả hai font qua class `font-sans`, `font-serif` và `font-mono` trong mã
DON'T: Kết hợp margin/padding với gap trên cùng một phần tử
DON'T: Dùng giá trị tùy ý trừ khi cực kỳ cần thiết: tránh `w-[347px]`
DON'T: Dùng `!important` hoặc thuộc tính tùy ý

## Testing Strategy

### Unit Testing

- Viết unit test kỹ lưỡng để kiểm tra từng function và component
- Dùng Vitest và React Testing Library để test React component hiệu quả và tin cậy
- Tuân theo pattern Arrange-Act-Assert để test rõ ràng và nhất quán
- Mock dependency bên ngoài và API call để cô lập unit test

### Integration Testing

- Tập trung vào luồng người dùng để đảm bảo chức năng ứng dụng
- Thiết lập và dọn dẹp môi trường test đúng cách để giữ test độc lập
- Dùng snapshot test có chọn lọc để phát hiện thay đổi UI ngoài ý muốn, tránh lạm dụng
- Tận dụng testing utility (ví dụ screen trong RTL) để test gọn và dễ đọc

```tsx
// Ví dụ: Component testing với React Testing Library
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UserProfile } from "@/components/user-profile";

describe("UserProfile Component", () => {
  test("displays user information correctly", async () => {
    const mockUser = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    };

    render(<UserProfile userId="1" />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  test("handles loading state", () => {
    render(<UserProfile userId="1" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

## Error Handling and Validation

### Form Validation

- Dùng Zod để validation schema
- Hiển thị thông điệp lỗi rõ ràng
- Sử dụng thư viện form phù hợp (ví dụ React Hook Form)

```tsx
// Ví dụ: Form validation với Zod và React Hook Form

// src/entities/user.ts

import z from 'zod';

export const createLoginFormSchema = (t: TFunction) => z.object({
  email: z.email(t('errors.email', { label: t('login.email') })),
  password: z.string().min(1, t('errors.required', { label: t('login.password') })),
});

export type LoginFormData = z.infer<ReturnType<typeof createLoginFormSchema>>;

// src/components/login-form.tsx
'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import type { LoginFormData } from '@/entities/user';
import { login } from '@/actions/auth-action';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLoginFormSchema } from '@/entities/user';

export default function LoginForm() {
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [hidePassword, setHidePassword] = useState(true);
  const [serverMessage, setServerMessage] = useState<{ success: boolean; message: string } | null>(
    null,
  );

  const LoginFormSchema = createLoginFormSchema(t);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerMessage(null);

    startTransition(async () => {
      const result = await login(data);
      setServerMessage(result);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.email')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder={t('login.email_placeholder')}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.password')}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type={hidePassword ? 'password' : 'text'}
                    placeholder={t('login.password_placeholder')}
                    disabled={isPending}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setHidePassword(!hidePassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                  disabled={isPending}
                >
                  {hidePassword
                    ? (
                        <EyeOff className="h-4 w-4" />
                      )
                    : (
                        <Eye className="h-4 w-4" />
                      )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full h-10 font-medium" disabled={isPending}>
          {isPending
            ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('login.signing_in')}
                </>
              )
            : (
                t('login.sign_in')
              )}
        </Button>
      </form>
    </Form>
  );
}
```

### Error Handling

- Cài đặt error boundary theo cấp route bằng `error.tsx` cho các lỗi UI có thể khôi phục và sử dụng `global-error.tsx` làm fallback toàn ứng dụng; ghi nhận ngoại lệ với Sentry như trong `src/app/global-error.tsx`.
- Hiển thị trạng thái 404 bằng `not-found.tsx` hoặc helper `notFound()`, và dùng `redirect()` để điều hướng trong Server Component hoặc action thay vì ném lỗi chung chung.
- Bao bọc Server Action và tiện ích phía server trong `try/catch`, log bằng `Logger.create('<Context>')`, và trả về object kết quả có kiểu rõ ràng để client render thông điệp lỗi nhất quán.
- Chuẩn hóa lỗi API thông qua `HttpClient` dùng chung (`src/lib/http-client.ts`) với `ApiError`; luôn ánh xạ chúng sang thông điệp và fallback thân thiện thay vì để lộ payload gốc.
- Ghép các trạng thái suspense với fallback thân thiện (spinner, skeleton, tùy chọn retry) và tránh để transition treo vô hạn — hiển thị toast/thông báo inline khi có thể retry.
- Bảo vệ middleware và edge handler khỏi input bất thường; kết thúc sớm bằng `NextResponse.next()` hoặc redirect để tránh lỗi dây chuyền.
- Xem logging và monitoring là một phần của xử lý lỗi: gắn thẻ sự kiện Sentry với locale/ngữ cảnh người dùng khi có thể và loại bỏ dữ liệu nhạy cảm trước khi gửi.


## Performance Optimization

### Frontend Optimization

- Chia nhỏ code bằng dynamic import
- Lazy load cho component không quan trọng
- Chiến lược caching cho phản hồi API
- Tối ưu hình ảnh bằng Next.js Image component

## Security Considerations

### Data Security

- Làm sạch input để tránh XSS
- Dùng DOMPurify để sanitize nội dung HTML
- Áp dụng phương thức xác thực phù hợp
- Validate mọi input từ người dùng

```tsx
// Ví dụ: Input sanitization với DOMPurify
import DOMPurify from "dompurify";

interface SafeHtmlProps {
  html: string;
  className?: string;
}

export function SafeHtml({ html, className }: SafeHtmlProps) {
  const sanitizedHtml = DOMPurify.sanitize(html);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
```

### Authentication & Authorization

- Xây dựng flow xác thực người dùng đúng chuẩn
- Sử dụng JWT một cách an toàn
- Áp dụng kiểm soát truy cập dựa trên vai trò
- Bảo mật endpoint API

## Accessibility (a11y)

### Core Requirements

- Dùng HTML semantic để tạo cấu trúc có ý nghĩa
- Áp dụng ARIA attribute chính xác khi cần
- Đảm bảo hỗ trợ điều hướng bằng bàn phím đầy đủ
- Quản lý thứ tự và mức độ hiển thị focus hiệu quả
- Duy trì tỷ lệ tương phản màu đáp ứng accessibility
- Giữ cấu trúc tiêu đề logic
- Bảo đảm mọi phần tử tương tác đều truy cập được
- Cung cấp thông báo lỗi rõ ràng và dễ tiếp cận

## Internationalization (i18n)

### Implementation with next-intl

- Sử dụng next-intl cho dịch thuật
- Cài đặt phát hiện locale chính xác
- Định dạng số và ngày tháng phù hợp
- Hỗ trợ RTL đúng cách
- Định dạng tiền tệ chuẩn xác
- Lưu trữ tài nguyên localization dưới `public/locales/<locale>/`; giữ nguyên namespace giữa các ngôn ngữ.

```tsx
// Ví dụ: Sử dụng translation
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'common',
  });

  return {
    title: t('title'),
  };
}

export default function Index() {
  const t = useTranslations('common');

  return (
    <h1 className="text-3xl font-bold">{t('app_name')}</h1>
  );
}
```

### Localized Routing

- Dùng segment `[locale]` ở cấp cao nhất trong App Router để bao bọc page; export `generateStaticParams` và gọi `setRequestLocale` bên trong layout để Next.js build sẵn từng locale.
- Lấy metadata theo locale với helper `next-intl` (`getTranslations`, `useTranslations`) và giữ namespace khớp với file trong `public/locales/<lang>/`.
- Tạo link đa ngôn ngữ bằng helper như `getI18nPath` (`src/lib/utils.ts`) hoặc các export `createNavigation`; tránh hard-code tiền tố locale trong component.
- Giữ URL của locale mặc định gọn gàng bằng cách cấu hình `localePrefix: 'as-needed'` trong `src/config/app-config.ts` và định nghĩa route.
- Đặt metadata phụ thuộc locale (title, description) trong `generateMetadata` và dùng locale lấy từ `props.params` thay vì dựa vào global state.
- Cập nhật middleware route matcher khi thêm khu vực protected hoặc public để cả `/[locale]/path` và đường dẫn mặc định cùng chia sẻ hành vi auth và locale.
- Đặt Server Action và loader có i18n cạnh route tương ứng; trả về chuỗi đã dịch từ server khi gửi thông điệp lỗi/thành công tới client component.

## Deployment Guide

### Build Process

```bash
# Build cho production
npm run build

# Khởi động server production
npm start
```

### Environment Variables for Production

```env
# Biến môi trường production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Monitoring and Logging

### Application Monitoring

- Theo dõi chỉ số hiệu năng
- Theo dõi lỗi với Sentry
- Phân tích hành vi người dùng
- Giám sát Core Web Vitals

### Log Management

- Logging có cấu trúc với cấp độ phù hợp
- Dùng tiện ích Logger từ `src/lib/logger.ts` để log nhất quán

```ts
import { Logger } from '@/lib/logger';
const logger = Logger.create('MyComponent');
logger.info('Informational message');
logger.warn('Warning message');
logger.error('Error message', errorObject);
```

## Common Issues

### Issue 1: Hydration Mismatch Errors

**Giải pháp**:

- Đảm bảo server và client render cùng nội dung
- Dùng `useEffect` cho logic chỉ chạy phía client
- Dùng import `dynamic` với `ssr: false` cho component chỉ chạy phía client
- Kiểm tra chênh lệch định dạng ngày/giờ giữa server và client

### Issue 2: Performance Issues with Large Lists

**Giải pháp**:

- Áp dụng virtualization cho dataset lớn
- Dùng pagination hoặc infinite scrolling
- Tối ưu re-render với `React.memo` và `useMemo`
- Cân nhắc filter và sort phía server

### Issue 3: TypeScript Type Errors in Production Build

**Giải pháp**:

- Bật strict mode trong cấu hình TypeScript
- Sửa mọi lỗi type trước khi deploy
- Dùng định nghĩa type phù hợp cho thư viện bên thứ ba
- Cài đặt error boundary phù hợp cho lỗi runtime liên quan đến type

### Issue 4: SEO and Meta Tags Not Working

**Giải pháp**:

- Dùng Next.js `Metadata` API trong App Router
- Thiết lập Open Graph tag đúng chuẩn
- Đảm bảo meta tag được render phía server
- Kiểm tra bằng công cụ debug của mạng xã hội

## Reference Resources

- [Next.js Official Documentation](https://nextjs.org/docs)
- [React Official Documentation](https://react.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
