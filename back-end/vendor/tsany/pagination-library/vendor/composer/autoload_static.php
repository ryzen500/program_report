<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit02fbbebe117db54c2adb62d33fc1c14d
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PaginationLibrary\\' => 18,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PaginationLibrary\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit02fbbebe117db54c2adb62d33fc1c14d::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit02fbbebe117db54c2adb62d33fc1c14d::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit02fbbebe117db54c2adb62d33fc1c14d::$classMap;

        }, null, ClassLoader::class);
    }
}