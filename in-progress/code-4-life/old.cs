using System;
using System.Linq;
using System.IO;
using System.Text;
using System.Collections;
using System.Collections.Generic;

/**
 * Bring data on patient samples from the diagnosis machine to the laboratory with enough molecules to produce medicine!
 **/
class Sample
{
    public int SampleID;
    public int CarriedBy;
    public int Rank;
    public char Gain;
    public int Health;
    
    public int CostA;
    public int CostB;
    public int CostC;
    public int CostD;
    public int CostE;
    
    // Customs
    public bool Diagnosed;
}
class Player
{
    
    static void Main(string[] args)
    {
        string[] inputs;
        int projectCount = int.Parse(Console.ReadLine());
        for (int i = 0; i < projectCount; i++)
        {
            inputs = Console.ReadLine().Split(' ');
            int a = int.Parse(inputs[0]);
            int b = int.Parse(inputs[1]);
            int c = int.Parse(inputs[2]);
            int d = int.Parse(inputs[3]);
            int e = int.Parse(inputs[4]);
        }
        
        List<Sample> samplesOld = null;
        
        // This will make it easier
        string currentRoute = "";
        string currentModule = "Start";
        int walkTime = 0;
        
        Sample mySample = null;
        int myState = 0;
        
        Dictionary<string, int> routeCosts = new Dictionary<string, int>();
        
        routeCosts.Add("Start-SAMPLES", 2);
        routeCosts.Add("Start-DIAGNOSIS", 2);
        routeCosts.Add("Start-MOLECULES", 2);
        routeCosts.Add("Start-LABORATORY", 2);
        
        routeCosts.Add("SAMPLES-SAMPLES", 0);
        routeCosts.Add("SAMPLES-DIAGNOSIS", 3);
        routeCosts.Add("SAMPLES-MOLECULES", 3);
        routeCosts.Add("SAMPLES-LABORATORY", 3);
        
        routeCosts.Add("DIAGNOSIS-SAMPLES", 3);
        routeCosts.Add("DIAGNOSIS-DIAGNOSIS", 0);
        routeCosts.Add("DIAGNOSIS-MOLECULES", 3);
        routeCosts.Add("DIAGNOSIS-LABORATORY", 4);

        routeCosts.Add("MOLECULES-SAMPLES", 3);
        routeCosts.Add("MOLECULES-DIAGNOSIS", 3);
        routeCosts.Add("MOLECULES-MOLECULES", 0);
        routeCosts.Add("MOLECULES-LABORATORY", 3);
        
        routeCosts.Add("LABORATORY-SAMPLES", 3);
        routeCosts.Add("LABORATORY-DIAGNOSIS", 4);
        routeCosts.Add("LABORATORY-MOLECULES", 3);
        routeCosts.Add("LABORATORY-LABORATORY", 0);
        
        // game loop
        while (true)
        {
            inputs = Console.ReadLine().Split(' ');
            string target = inputs[0];
            int eta = int.Parse(inputs[1]);
            int score = int.Parse(inputs[2]);
            int storageA = int.Parse(inputs[3]);
            int storageB = int.Parse(inputs[4]);
            int storageC = int.Parse(inputs[5]);
            int storageD = int.Parse(inputs[6]);
            int storageE = int.Parse(inputs[7]);
            int expertiseA = int.Parse(inputs[8]);
            int expertiseB = int.Parse(inputs[9]);
            int expertiseC = int.Parse(inputs[10]);
            int expertiseD = int.Parse(inputs[11]);
            int expertiseE = int.Parse(inputs[12]);
            
            Console.ReadLine();

            inputs = Console.ReadLine().Split(' ');
            int availableA = int.Parse(inputs[0]);
            int availableB = int.Parse(inputs[1]);
            int availableC = int.Parse(inputs[2]);
            int availableD = int.Parse(inputs[3]);
            int availableE = int.Parse(inputs[4]);
            int sampleCount = int.Parse(Console.ReadLine());
            
            List<Sample> samples = new List<Sample>();
            
            for (int i = 0; i < sampleCount; i++)
            {
                inputs = Console.ReadLine().Split(' ');
                
                Sample sam = new Sample();
                
                sam.SampleID = int.Parse(inputs[0]);
                sam.CarriedBy = int.Parse(inputs[1]);
                sam.Rank = int.Parse(inputs[2]);
                sam.Gain = char.Parse(inputs[3]);
                sam.Health = int.Parse(inputs[4]);
                
                sam.CostA = int.Parse(inputs[5]);
                sam.CostB = int.Parse(inputs[6]);
                sam.CostC = int.Parse(inputs[7]);
                sam.CostD = int.Parse(inputs[8]);
                sam.CostE = int.Parse(inputs[9]);
                
                if (samplesOld == null)
                {
                    sam.Diagnosed = false; // Implicitly false
                }
                else
                {
                    sam.Diagnosed = samplesOld.Any(x => x.SampleID == sam.SampleID)
                                    ? 
                                    samplesOld.First(x => x.SampleID == sam.SampleID).Diagnosed
                                    :
                                    false;
                }
                
                samples.Add(sam);
            }

            string cmd = ""; // My command
            
            // Check if I'm walking
            if (currentRoute != "")
            {
                // Yeah...guess I'm on the run xD
                if (routeCosts[currentRoute] <= walkTime)
                {
                    // Oh...I am already here? Time surely goes fast
                    currentModule = currentRoute.Split('-')[1];
                    currentRoute = "";
                    walkTime = 0;
                }
            }
            if (currentRoute == "") // Wow...it's getting quite complicated, isn't it?
            {
                List<Sample> mySamples = samples.Where(x => x.CarriedBy == 0).ToList();
                // Check inventory for samples
                if (samples.Where(x => x.CarriedBy == 0).Count() > 0 && myState != 0) //
                {
                    mySample = samples.First(x => x.CarriedBy == 0); // My sample!!
                    // I must check if there is available the required amount of 'ingredients'...lol just joking, I meant components
                    if (mySamples.All(x => storageA + availableA + expertiseA < x.CostA ||
                        storageB + availableB + expertiseB < x.CostB ||
                        storageC + availableC + expertiseC < x.CostC ||
                        storageD + availableD + expertiseD < x.CostD ||
                        storageE + availableE + expertiseE < x.CostE)) /*(storageA + availableA + expertiseA < mySample.CostA ||
                        storageB + availableB + expertiseB < mySample.CostB ||
                        storageC + availableC + expertiseC < mySample.CostC ||
                        storageD + availableD + expertiseD < mySample.CostD ||
                        storageE + availableE + expertiseE < mySample.CostE)*/
                    {
                        // Oh NO! There isn't enough components! I should (return this sample and) work on something else...
                        if (target == "DIAGNOSIS")
                        {
                            cmd = "CONNECT " + mySample.SampleID;
                        }
                        else
                        {
                            cmd = "GOTO DIAGNOSIS";
                        }
                    }
                    else
                    {
                        // The first thing I need to do is to ANALYZE this thing!
                        if (mySamples.Any(x => !x.Diagnosed)) //!mySample.Diagnosed
                        {
                            // I am there already?
                            if (target == "DIAGNOSIS")
                            {
                                // Niceee
                                if (mySamples.All(x => storageA + expertiseA < x.CostA ||
                                                        storageB + expertiseB < x.CostB ||
                                                        storageC + expertiseC < x.CostC ||
                                                        storageD + expertiseD < x.CostD ||
                                                        storageE + expertiseE < x.CostE)
                                                        &&
                                                        storageA + storageB + storageC + storageD + storageE == 10)
                                {
                                    Sample theSample = mySamples.First();
                                    cmd = "CONNECT " + theSample.SampleID;
                                }
                                else
                                {
                                    Sample theSample = mySamples.First(x => !x.Diagnosed);
                                    theSample.Diagnosed = true;
                                    cmd = "CONNECT " + theSample.SampleID;//mySample.SampleID;
                                }
                            }
                            else
                            {
                                // Fine...I guess I'll HAVE TO GO to this module first
                                cmd = "GOTO DIAGNOSIS";
                            }
                        }
                        else if (mySamples.Any(x => x.CostA + x.CostB + x.CostC + x.CostD + x.CostE > 10 + expertiseA + expertiseB + expertiseC + expertiseD + expertiseE))//(mySample.CostA + mySample.CostB + mySample.CostC + mySample.CostD + mySample.CostE > 10 + expertiseA + expertiseB + expertiseC + expertiseD + expertiseE)
                        {
                            // Wtf is this?! I'd rather throw it into the cloud than complete it..........
                            cmd = "CONNECT " + mySamples.First(x => x.CostA + x.CostB + x.CostC + x.CostD + x.CostE > 10 + expertiseA + expertiseB + expertiseC + expertiseD + expertiseE).SampleID;//mySample.SampleID;
                        }
                        else
                        {
                            // Hm...do I have to get some components or just go to the LABORATORY?
                            if (mySamples.Any(x => storageA + expertiseA >= x.CostA && storageB + expertiseB >= x.CostB && storageC + expertiseC >= x.CostC && storageD + expertiseD >= x.CostD && storageE + expertiseE >= x.CostE))//(storageA + expertiseA >= mySample.CostA && storageB + expertiseB >= mySample.CostB && storageC + expertiseC >= mySample.CostC && storageD + expertiseD >= mySample.CostD && storageE + expertiseE >= mySample.CostE)
                            {
                                // Huh...so, LABORATORY it is!
                                if (target == "LABORATORY")
                                {
                                    // I'm here, nice...
                                    cmd = "CONNECT " + mySamples.First(x => storageA + expertiseA >= x.CostA && storageB + expertiseB >= x.CostB && storageC + expertiseC >= x.CostC && storageD + expertiseD >= x.CostD && storageE + expertiseE >= x.CostE).SampleID;//mySample.SampleID;
                                }
                                else
                                {
                                    // CHARGEEE!!!!!!
                                    cmd = "GOTO LABORATORY";
                                }
                            }
                            else
                            {
                                // I have work to do
                                // Which sample goes first?
                                Sample workingSample =  mySamples.First(x => !(storageA + availableA + expertiseA < x.CostA ||
                                                        storageB + availableB + expertiseB < x.CostB ||
                                                        storageC + availableC + expertiseC < x.CostC ||
                                                        storageD + availableD + expertiseD < x.CostD ||
                                                        storageE + availableE + expertiseE < x.CostE));
                                if (storageA + storageB + storageC + storageD + storageE == 10)
                                {
                                    cmd = "GOTO DIAGNOSIS";
                                }
                                else
                                {
                                    // Have to get the missing components
                                    // Am I at the MOLECULES module?
                                    if (target == "MOLECULES")
                                    {
                                        // Yeah, I am....greaaaat
                                        // So...which component to take?
                                        if (storageA + expertiseA < workingSample.CostA)
                                        {
                                            if (availableA == 0)
                                            {
                                                cmd = "GOTO SAMPLES";
                                            }
                                            else
                                            {
                                                // Aah...YOU are the MISSING ONE!
                                                cmd = "CONNECT A";
                                            }
                                        }
                                        else if (storageB + expertiseB < workingSample.CostB)
                                        {
                                            if (availableB == 0)
                                            {
                                                cmd = "GOTO SAMPLES";
                                            }
                                            else
                                            {
                                                // Aah...YOU are the MISSING ONE!
                                                cmd = "CONNECT B";
                                            }
                                        }
                                        else if (storageC + expertiseC < workingSample.CostC)
                                        {
                                            if (availableC == 0)
                                            {
                                                cmd = "GOTO SAMPLES";
                                            }
                                            else
                                            {
                                                // Aah...YOU are the MISSING ONE!
                                                cmd = "CONNECT C";
                                            }
                                        }
                                        else if (storageD + expertiseD < workingSample.CostD)
                                        {
                                            if (availableD == 0)
                                            {
                                                cmd = "GOTO SAMPLES";
                                            }
                                            else
                                            {
                                                // Aah...YOU are the MISSING ONE!
                                                cmd = "CONNECT D";
                                            }
                                        }
                                        else if (storageE + expertiseE < workingSample.CostE)
                                        {
                                            if (availableE == 0)
                                            {
                                                cmd = "GOTO SAMPLES";
                                            }
                                            else
                                            {
                                                // Aah...YOU are the MISSING ONE!
                                                cmd = "CONNECT E";
                                            }
                                        }
                                        else
                                        {
                                            // WHAAAAT?! I already have all of them? How is it possible? Gotta go to the LABORATORY module right NOW!
                                            cmd = "GOTO LABORATORY";
                                        }
                                    }
                                    else
                                    {
                                        // Nah...omg
                                        cmd = "GOTO MOLECULES";
                                    }
                                }
                                
                            }
                        }
                    }
                }
                else
                {
                    // Gotta get me some work to do
                    // But firstly I have to GO to the SAMPLES module
                    if (target == "SAMPLES")
                    {
                        // So...which one shall I take? Hehehe...maybe the hardest one?
                        int level = ((expertiseA + expertiseB + expertiseC + expertiseD + expertiseE) / 4) + 1;
                        level = level > 3 ? 3 : level;
                        cmd = "CONNECT " + level; // I'll trust myself with this one
                        
                        myState = samples.Where(x => x.CarriedBy == 0).Count() >= 2 ? 1 : 0;
                    }
                    else
                    {
                        // The worker's job never ends...
                        cmd = "GOTO SAMPLES";
                        myState = 0;
                    }
                }
            }
            else
            {
                cmd = "WAIT";
            }
            

            samplesOld = samples;
            
            if (cmd.Contains("GOTO"))
            {
                currentRoute = currentModule + "-" + cmd.Split(' ')[1];
                currentModule = "";
            }
            if (currentRoute != "")
                    walkTime++;

            // Write an action using Console.WriteLine()
            // To debug: Console.Error.WriteLine("Debug messages...");

            Console.WriteLine(cmd);
        }
    }
}