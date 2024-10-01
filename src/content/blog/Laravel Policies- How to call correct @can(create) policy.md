---
layout: '../../layouts/SingleBlogLayout.astro'
title: 'Laravel Policies: How to correctly call @can(create) from blade'
description: 'As a developer, you often encounter small challenges that test not just your technical knowledge but also your patience. One such situation arose when I was trying to create a policy to allow users to add reviews for providers in my application. Laravel’s policies are great for access control, but this time _(I am talking as if I have used policies hundred times, when in fact I am creating a policy for the first time in my life.)_, I encountered a challenge that seemed simple yet made me pause and reflect.'
isDraft: false
pubDate: '30-09-2024'
image:
  src: '/images/blog/laravel.avif'
  alt: 'Astro website'
tags:
  - 'laravel'
  - 'policy'
  - 'blade'
---

### First Step: Defining the Policy

To implement the necessary logic, I started by creating a policy for the `Review` model. My goal was to allow review creation only if the logged-in user wasn’t the owner of the provider.

I initially defined the `create_review` method in the policy like this:

```php
public function create_review(User $user, Provider $provider): bool
{
    return $user->id !== $provider->user_id;
}
```

So far, everything looked fine. The policy was straightforward: users can’t add reviews for their own providers. After adding the method, I moved on to Blade to integrate the logic using the `@can` directive.

### The Roadblock

In Blade, I called the policy like this:

```php
@can('create_review', $provider)
    <livewire:Provider.ReviewForm :$provider wire:key="review_form" />
@else
    You cannot add a review for this provider.
@endcan
```

In theory, this should work perfectly. But no matter what the policy returned—`true` or `false`—the message that always appeared was: “You cannot add a review for this provider.”

I reviewed the code, debugged, and checked if there was any issue with model relationships. Nothing seemed to explain why other methods in the policy (edit, delete) worked, but `create_review` didn’t.

### The Realization

After numerous attempts and code tweaks, a simple truth emerged, hinted by a comment I found on <a href="https://stackoverflow.com/questions/36482737/laravel-policies-how-to-pass-multiple-arguments-to-function" target="_blank">StackOverflow</a>. The issue wasn’t with the method itself, but with how I was calling the policy in Blade.

In the end, here’s how I correctly called the policy in Blade:

```php
@can('create', [App\Models\Review::class, $provider])
    <livewire:Provider.ReviewForm :$provider wire:key="review_form" />
@endcan
```

The issue wasn’t the method name (`create_review` vs. `create`), but how I was using the `@can` directive in Blade. To ensure Laravel knew I was referring to `ReviewPolicy`, I had to pass the `Review` class explicitly as the first argument:

```php
@can('create', [App\Models\Review::class, $provider])
```

Without this array, meaning without the first argument in it, Laravel assumed I was referring to `ProviderPolicy` because I was only passing the `Provider` model. Since that policy didn’t exist, no clear errors were shown. The solution was to explicitly specify the model class in the Blade call.

And, of course, the method in the policy was adjusted:

```php
public function create(User $user, Provider $provider): bool
{
    return $user->id !== $provider->user_id;
}
```

I hope my experience helps you avoid the same pitfalls and approach policies with confidence!
