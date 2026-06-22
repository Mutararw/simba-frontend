import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Login from "@/pages/Login"
import { useAuth } from "@/store/auth"

vi.mock("@/store/auth")

const mockSetUser = vi.fn()

vi.mocked(useAuth).mockReturnValue({ setUser: mockSetUser })

describe("Login Component", () => {
  afterEach(() => {
    vi.clearAllMocks()
    useAuth.setState({ user: null, setUser: mockSetUser })
  })

  it("renders login form with all role tabs", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText("Access your Simba Supermarket portal")).toBeInTheDocument()
    expect(screen.getByText("Client")).toBeInTheDocument()
    expect(screen.getByText("Manager")).toBeInTheDocument()
    expect(screen.getByText("Admin")).toBeInTheDocument()
    expect(screen.getByText("Supplier")).toBeInTheDocument()
  })

  it("shows customer role by default", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    const clientButton = screen.getByRole("button", { name: "Client" })
    expect(clientButton).toHaveClass("bg-card text-primary")
  })

  it("switches to manager role when clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    const managerButton = screen.getByRole("button", { name: "Manager" })
    fireEvent.click(managerButton)

    await waitFor(() => {
      expect(managerButton).toHaveClass("bg-card text-primary")
    })
  })

  it("shows branch selection for manager role", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    const managerTab = screen.getByText("Manager")
    fireEvent.click(managerTab)

    await waitFor(() => {
      expect(screen.getByLabelText("Select Your Branch")).toBeInTheDocument()
    })
  })

  it("does not show branch selection for customer role", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.queryByLabelText("Select Your Branch")).not.toBeInTheDocument()
  })

  it("shows password toggle button", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText("••••••••")
    const eyeButton = passwordInput.parentElement?.querySelector("button[type='button']")
    expect(eyeButton).toBeInTheDocument()
  })

  it("toggles password visibility when eye button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    )

    const passwordInput = screen.getByPlaceholderText("••••••••")
    const eyeButton = passwordInput.parentElement?.querySelector("button[type='button']")
    fireEvent.click(eyeButton as Element)

    await waitFor(() => {
      expect(passwordInput).toHaveAttribute("type", "text")
    })
  })
})