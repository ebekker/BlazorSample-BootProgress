# BlazorSample-BootProgress

Sample of client-side Blazor with an improved boot up sequence

---

This Blazor sample shows how to improve the screen shown during "boot up" of a client-side Blazor
application to provide more pleasant user experience with more user feedback about its progress.

You can see this example running [here](http://bootprogress.blazorsample.bkkr.us).

The sample builds on various other contributions.  For starters, we add a small progress animation
based on [SpinKit](https://tobiasahlin.com/spinkit/) to improve the aesthetics.

Next, we adapt the enhancements in
[this article](https://remibou.github.io/Change-Blazor-DLL-extension-with-ASPNET-Core/)
that describes a technique for intercepting calls to load the initial DLL assemblies during
Blazor's stock boot up process.  The original intent is to change the visible DLL file extensions
for those scenarios where they are blocked from loading, for example by corporate firewalls.

We build on this technique to provide load status to the user as each DLL assembly is loaded, to
give the user some feedback as to the overall boot up progress.

## Artificial Delay

Because the stock Blazor client sample (`dotnet new blazor`) doesn't have many DLLs to load, the
boot up screen may actually run relatively quickly (defeating the need for this technique), but
you'll find this useful in larger, more real-world applications that may have many more and larger
CLR assemblies to load.

In order to simulate what you would actually experience with a larger set of assemblies, this
sample has an _artificial_ load delay of `200ms` per DLL built in.  And you can adjust this value
or disable it completely with some URL query parameters (see below).

## Query Parameters

You can adjust various settings of this sample by providing query parameters to play around with
the behavior:

* **`dll_min`** - the minimum progress bar value, defaults to `0`
* **`dll_max`** - the maximum progress bar value, defaults to `25` which is the number of DLLs
  loaded by this example
* **`dll_val`** - the starting progress bar value, defaults to `0` before any DLLs are loaded
* **`dll_msg`** - the initial progress message, defaults to `Loading application...` and will
  get replaced as each DLL is loaded
* **`xhr_send_delay_factor`** - if > 0, will enable artificial send delay by the factor number
  of milliseconds per DLL, defaults to `100`
* **`xhr_send_abort_count`** - if > 0, will abort the boot process after that number of DLLs
  have loaded, useful to take a snapshot of the progress bar working, defaults to `0`
