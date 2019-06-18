# BlazorSample-BootProgress

Sample of client-side Blazor with an improved boot up sequence

---

This Blazor sample shows how to improve the screen shown during "boot up" of a client-side Blazor
application to provide more pleasant user experience with more user feedback about its progress.

The sample builds on various other contributions.  For starters, we add a small progress animation
based on [SpinKit](https://tobiasahlin.com/spinkit/) to improve the aesthetics.

Next, we adapt the enhancements in
[this article](https://remibou.github.io/Change-Blazor-DLL-extension-with-ASPNET-Core/)
that describes a technique for intercepting calls to load the initial DLL assemblies during
Blazor's stock boot up process.  The original intent is to change the visible DLL file extensions
for those scenarios where they are blocked from loading, for example by corporate firewalls.

We build on this technique to provide load status to the user as each DLL assembly is loaded, to
give the user some feedback as to the overall boot up progress.
