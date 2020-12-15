<?php


namespace App\Controller;


use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;

class InvoiceIncrementationController
{
    /**
     * @var EntityManagerInterface
     */
    private $manager;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager = $manager;
    }

    /**
     * @param Invoice $data Value of chrono properties
     * @return Invoice
     */
    final public function __invoke(Invoice $data): Invoice
    {
        $data->setChrono($data->getChrono() + 1);

        $this->manager->flush();

        return $data;
    }
}
