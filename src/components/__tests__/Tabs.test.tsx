import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabPanel } from "../Tab";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      onClick,
      ...props
    }: {
      children: React.ReactNode;
      onClick?: (event: React.MouseEvent) => void;
      [key: string]: any;
    }) => (
      <div onClick={onClick} data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe("Tabs Component", () => {
  const tabs = [
    { id: "tab1", label: "Tab 1" },
    { id: "tab2", label: "Tab 2" },
    { id: "tab3", label: "Tab 3" },
  ];

  const mockSetSelectedTab = jest.fn();

  beforeEach(() => {
    mockSetSelectedTab.mockClear();
  });

  test("renders all tab buttons", () => {
    render(
      <Tabs
        tabs={tabs}
        selectedTab="tab1"
        setSelectedTab={mockSetSelectedTab}
      />
    );

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  test("highlights the selected tab", () => {
    render(
      <Tabs
        tabs={tabs}
        selectedTab="tab2"
        setSelectedTab={mockSetSelectedTab}
      />
    );

    const tab1 = screen.getByText("Tab 1");
    const tab2 = screen.getByText("Tab 2");

    expect(tab1).toHaveClass("text-white/60");
    expect(tab2).toHaveClass("text-orange-400");
  });

  test("calls setSelectedTab when a tab is clicked", () => {
    render(
      <Tabs
        tabs={tabs}
        selectedTab="tab1"
        setSelectedTab={mockSetSelectedTab}
      />
    );

    fireEvent.click(screen.getByText("Tab 3"));
    expect(mockSetSelectedTab).toHaveBeenCalledWith("tab3");
  });

  test("applies custom class names", () => {
    render(
      <Tabs
        tabs={tabs}
        selectedTab="tab1"
        setSelectedTab={mockSetSelectedTab}
        className="custom-tabs"
        tabsContainerClassName="custom-container"
      />
    );

    const tabsElement = screen.getByRole("tablist").parentElement;
    expect(tabsElement).toHaveClass("custom-tabs");

    const tabsContainer = screen.getByRole("tablist");
    expect(tabsContainer).toHaveClass("custom-container");
  });
});

describe("TabPanel Component", () => {
  test("renders content when selected", () => {
    render(
      <TabPanel id="tab1" selectedTab="tab1" className="custom-panel">
        <div>Tab 1 Content</div>
      </TabPanel>
    );

    expect(screen.getByText("Tab 1 Content")).toBeInTheDocument();
  });

  test("does not render content when not selected", () => {
    render(
      <TabPanel id="tab1" selectedTab="tab2" className="custom-panel">
        <div>Tab 1 Content</div>
      </TabPanel>
    );

    expect(screen.queryByText("Tab 1 Content")).not.toBeInTheDocument();
  });

  test("applies custom class name", () => {
    render(
      <TabPanel id="tab1" selectedTab="tab1" className="custom-panel">
        <div>Tab 1 Content</div>
      </TabPanel>
    );

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveClass("custom-panel");
  });
});
