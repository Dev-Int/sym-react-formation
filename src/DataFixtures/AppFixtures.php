<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AppFixtures extends Fixture
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    final public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        for ($u = 0; $u < 10; $u++) {
            $user = new User();

            $chrono = 1;

            $hash = $this->encoder->encodePassword($user, 'password');

            if ($u === 0) {
                $user->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setEmail('test@test.com')
                    ->setRoles(['ROLE_ADMIN'])
                    ->setPassword($hash)
                ;
            } else {
                $user->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setEmail($faker->email)
                    ->setRoles(['ROLE_USER'])
                    ->setPassword($hash)
                ;
            }

            $manager->persist($user);

            for ($c = 0, $cMax = mt_rand(5, 20); $c < $cMax; $c++) {
                $customer = (new Customer())
                    ->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName)
                    ->setCompany($faker->company)
                    ->setEmail($faker->email)
                    ->setUser($user)
                ;

                $manager->persist($customer);

                for ($i = 0, $iMax = mt_rand(3, 10); $i < $iMax; $i++) {
                    $invoice = (new Invoice())
                        ->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($customer)
                        ->setChrono($chrono)
                    ;

                    $chrono++;

                    $manager->persist($invoice);
                }
            }
        }

        $manager->flush();
    }
}
