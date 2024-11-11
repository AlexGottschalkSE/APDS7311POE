import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";
import { useNavigate } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Login Component", () => {
  const mockedNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockedNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    localStorage.clear();
  });

  test("renders login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText("Account Number")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("successful login", async () => {
    const mockResponse = { userType: "Employee", id: "1" };

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
    );

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Account Number"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Login successful!")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/EmployeeDashboard");
    });
  });

  test("failed login", async () => {
    const mockResponse = { message: "Invalid credentials" };

    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.resolve(mockResponse) })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Account Number"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/login failed: invalid credentials/i)
      ).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Account Number"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
    });
  });
});
