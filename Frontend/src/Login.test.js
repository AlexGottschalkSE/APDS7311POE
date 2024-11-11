import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Login from "./Login";

describe("Login Component", () => {
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
        expect(screen.getByPlaceholderText("ID")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    });

    test("successful login", async () => {
        const mockResponse = { userType: "Employee" };
        global.fetch = jest.fn(() => 
            Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
        );

        render(
            <MemoryRouter initialEntries={["/"]}>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("ID"), { target: { value: "12345" } });
        fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(localStorage.getItem("accNo")).toBe("12345");
            expect(localStorage.getItem("userType")).toBe("Employee");
            expect(screen.queryByText("Login successful!")).toBeInTheDocument();
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

        fireEvent.change(screen.getByPlaceholderText("ID"), { target: { value: "12345" } });
        fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "wrongpassword" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/login failed: invalid credentials/i)).toBeInTheDocument();
        });
    });

    test("handles fetch error", async () => {
        global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText("ID"), { target: { value: "12345" } });
        fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
        fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password" } });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/error: network error/i)).toBeInTheDocument();
        });
    });
});
