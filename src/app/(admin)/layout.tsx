import AdminLayout from "./components/Layout";

function Layout({ children }: { children: JSX.Element }) {
    return (
        <div data-component="Layout">
            <AdminLayout>{children}</AdminLayout>
        </div>
    );
}

export default Layout;
