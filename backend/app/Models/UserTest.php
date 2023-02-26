<?php

namespace App\Models;

use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    public function test_user_has_expected_fields(): void
    {
        $user = User::factory()->create([
            'name' => 'Danny',
            'email' => 'danny@example.com',
        ]);

        $this->assertEquals('Danny', $user->name);
        $this->assertEquals('danny@example.com', $user->email);
    }
}
